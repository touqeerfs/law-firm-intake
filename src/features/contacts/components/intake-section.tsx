import { useFormContext, useWatch } from 'react-hook-form';
import { CalendarDays } from 'lucide-react';
import { Choice, ChoiceGroup } from '@/components/ui/choice';
import { Field } from '@/components/ui/field';
import { FormCard } from '@/components/ui/form-card';
import { Select, TextInput } from '@/components/ui/input';
import { cx } from '@/lib/cx';
import { toDateInputValue } from '@/lib/dates';
import {
  attorneyIdSchema,
  attorneys,
  closeReasons,
  closeReasonSchema,
  conflictCheckSchema,
  statusDetails,
  statusSchema,
} from '../contact-model';
import type { ContactFormInput } from '../contact-form-schema';
import { useContactFormField } from '../use-contact-form-field';
import { conflictCheckTags, statusDotClasses } from './contact-fields';

export function IntakeSection() {
  const {
    register,
    clearErrors,
    formState: { errors },
  } = useFormContext<ContactFormInput>();
  const fieldProps = useContactFormField();
  const status = useWatch<ContactFormInput, 'status'>({ name: 'status' });

  return (
    <FormCard
      icon={CalendarDays}
      title="Intake & follow-up"
      description="Where this inquiry stands and when the team should call next."
    >
      <ChoiceGroup legend="Stage" hint={`${statusDetails[status].hint}.`}>
        {statusSchema.options.map((option) => (
          <Choice
            key={option}
            value={option}
            {...register('status', {
              onChange: () => clearErrors(['followUpDate', 'closeReason']),
            })}
          >
            <span aria-hidden className={cx('size-2 rounded-full', statusDotClasses[option])} />
            {statusDetails[option].label}
          </Choice>
        ))}
      </ChoiceGroup>

      {status === 'closed' ? (
        <Field
          htmlFor="closeReason"
          label="Close reason"
          required
          error={errors.closeReason?.message}
        >
          <Select {...fieldProps('closeReason')}>
            <option value="" disabled>
              Why is it closed?
            </option>
            {closeReasonSchema.options.map((reason) => (
              <option key={reason} value={reason}>
                {closeReasons[reason].label}
              </option>
            ))}
          </Select>
        </Field>
      ) : (
        <Field
          htmlFor="followUpDate"
          label="Next follow-up"
          error={errors.followUpDate?.message}
          hint="Defaults to tomorrow. Leave blank if no call is planned."
        >
          <TextInput
            {...fieldProps('followUpDate')}
            type="date"
            min={toDateInputValue(new Date())}
          />
        </Field>
      )}

      <Field htmlFor="attorneyId" label="Assigned attorney" optional>
        <Select {...fieldProps('attorneyId')}>
          <option value="">Unassigned</option>
          {attorneyIdSchema.options.map((attorneyId) => (
            <option key={attorneyId} value={attorneyId}>
              {attorneys[attorneyId].name}
            </option>
          ))}
        </Select>
      </Field>

      <ChoiceGroup legend="Conflict check">
        {conflictCheckSchema.options.map((option) => {
          const { label, icon: Icon } = conflictCheckTags[option];
          return (
            <Choice key={option} value={option} {...register('conflictCheck')}>
              <Icon className="size-3.75" aria-hidden />
              {label}
            </Choice>
          );
        })}
      </ChoiceGroup>
    </FormCard>
  );
}
