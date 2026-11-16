import { useState } from 'react';
import {
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type Announcements,
  type CollisionDetection,
  type DndContextProps,
  type KeyboardCoordinateGetter,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import {
  statusDetails,
  statusSchema,
  type Contact,
  type Status,
} from '@/features/contacts/contact-model';

const COLUMN_INSET_PX = 6;

function toStatus(id: UniqueIdentifier | undefined): Status | null {
  return statusSchema.safeParse(id).data ?? null;
}

const pointerThenRect: CollisionDetection = (args) => {
  const underPointer = pointerWithin(args);
  return underPointer.length > 0 ? underPointer : rectIntersection(args);
};

const columnSteps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 };

const jumpToColumn: KeyboardCoordinateGetter = (event, { context }) => {
  const step = columnSteps[event.code];
  if (step === undefined) return;
  event.preventDefault();

  const columns = statusSchema.options;
  const current = columns.findIndex((status) => status === context.over?.id);
  const target = columns[current + step];
  const rect = target && context.droppableRects.get(target);
  if (!rect) return;
  return { x: rect.left + COLUMN_INSET_PX, y: rect.top + COLUMN_INSET_PX };
};

export function useBoardDrag(contacts: Contact[], onMove: (contact: Contact, to: Status) => void) {
  const [dragged, setDragged] = useState<Contact | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: jumpToColumn,
      keyboardCodes: { start: ['Space'], cancel: ['Escape'], end: ['Space'] },
    }),
  );

  const findContact = (id: UniqueIdentifier) => contacts.find((contact) => contact.id === id);
  const nameOf = (id: UniqueIdentifier) => findContact(id)?.name ?? 'The card';

  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${nameOf(active.id)}.`,
    onDragOver: ({ active, over }) => {
      const to = toStatus(over?.id);
      return to
        ? `${nameOf(active.id)} is over ${statusDetails[to].label}.`
        : `${nameOf(active.id)} is not over a column.`;
    },
    onDragEnd: ({ active, over }) => {
      const contact = findContact(active.id);
      const to = toStatus(over?.id);
      return contact && to && to !== contact.status
        ? `Moved ${contact.name} to ${statusDetails[to].label}.`
        : 'Cancelled.';
    },
    onDragCancel: () => 'Cancelled.',
  };

  const contextProps: DndContextProps = {
    sensors,
    collisionDetection: pointerThenRect,
    accessibility: {
      announcements,
      screenReaderInstructions: {
        draggable: 'Press space to pick up, arrow keys to move, space to drop, Escape to cancel.',
      },
    },
    onDragStart: ({ active }) => setDragged(findContact(active.id) ?? null),
    onDragCancel: () => setDragged(null),
    onDragEnd: ({ active, over }) => {
      setDragged(null);
      const contact = findContact(active.id);
      const to = toStatus(over?.id);
      if (contact && to) onMove(contact, to);
    },
  };

  return { dragged, contextProps };
}
