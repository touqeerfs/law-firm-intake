import { useFormContext } from 'react-hook-form';
import { fieldMessageId } from '@/components/ui/field';
import type { ContactFormField, ContactFormInput } from './contact-form-schema';

export function useContactFieldProps() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ContactFormInput>();

  return function fieldProps(name: ContactFormField, onChange?: () => void) {
    return {
      ...register(name, { onChange }),
      id: name,
      'aria-invalid': errors[name] ? true : undefined,
      'aria-describedby': fieldMessageId(name),
    };
  };
}
