import { useFormContext, useWatch } from 'react-hook-form';
import { Briefcase } from 'lucide-react';
import { Field } from '@/components/ui/field';
import { FormCard } from '@/components/ui/form-card';
import { Select, TextArea, TextInput } from '@/components/ui/input';
import { cx } from '@/lib/cx';
import { matterTypeSchema, sourceSchema } from '../contact-model';
import { SUMMARY_MAX_LENGTH, type ContactFormInput } from '../contact-form-schema';
import { useContactFormField } from '../use-contact-form-field';

export function MatterSection() {
  const {
    clearErrors,
    formState: { errors },
  } = useFormContext<ContactFormInput>();
  const fieldProps = useContactFormField();
  const [source, summary] = useWatch<ContactFormInput, ['source', 'summary']>({
    name: ['source', 'summary'],
  });

  return (
    <FormCard
      icon={Briefcase}
      title="The matter"
      description="In their words. Attorneys read this before the consultation."
    >
      <Field htmlFor="matterType" label="Matter type" required error={errors.matterType?.message}>
        <Select {...fieldProps('matterType')}>
          <option value="" disabled>
            Choose a matter type
          </option>
          {matterTypeSchema.options.map((matterType) => (
            <option key={matterType}>{matterType}</option>
          ))}
        </Select>
      </Field>

      <Field htmlFor="source" label="How they found us" required error={errors.source?.message}>
        <Select {...fieldProps('source', () => clearErrors('referredBy'))}>
          <option value="" disabled>
            Choose a source
          </option>
          {sourceSchema.options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </Select>
      </Field>

      {source === 'Referral' && (
        <Field
          htmlFor="referredBy"
          label="Referred by"
          required
          wide
          error={errors.referredBy?.message}
        >
          <TextInput
            {...fieldProps('referredBy')}
            placeholder="Person or firm, e.g. Former client · N. Haider"
          />
        </Field>
      )}

      <Field
        htmlFor="summary"
        label="Summary"
        required
        wide
        error={errors.summary?.message}
        aside={
          <span
            className={cx(
              'text-xs text-faint tabular-nums',
              summary.length > SUMMARY_MAX_LENGTH && 'font-semibold text-danger-fg',
            )}
          >
            {summary.length} / {SUMMARY_MAX_LENGTH}
          </span>
        }
      >
        <TextArea
          {...fieldProps('summary')}
          rows={4}
          placeholder="e.g. Dismissed two weeks after reporting a safety issue. Has emails and the termination letter."
        />
      </Field>
    </FormCard>
  );
}
