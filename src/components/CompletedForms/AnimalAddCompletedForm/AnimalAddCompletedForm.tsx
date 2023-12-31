import React, { forwardRef, useMemo, useImperativeHandle, useRef } from 'react';
import cn from 'clsx';
import { useTranslation } from 'react-i18next';
import { FetchResult, useMutation } from '@apollo/client';
import { FormikConfig, useFormik } from 'formik';
import { AnimalForm, AnimalFormErrors, AnimalFormProps } from 'src/components/Forms';
import { createErrorHandlers } from 'src/utils/createErrorHandlers';
import { Button, message } from 'antd';
import { isNotDefinedString } from 'src/utils/validation';
import { Title } from 'src/components/Title';
import deepEqual from 'fast-deep-equal';
import { deepClear } from 'src/utils/deepClear';
import { AnimalAddInput } from 'src/server.types';
import { ADD_ANIMAL, AddAnimalData, AddAnimalVars } from './connection';
import s from './AnimalAddCompletedForm.sass';

export type AnimalAddCompletedFormProps = Omit<AnimalFormProps, 'formManager'> & {
  className?: string;
  onSuccess?: (result: FetchResult<AddAnimalData>) => void;
  title: React.ReactNode;
  submitText: React.ReactNode;
  successMessageText: React.ReactNode;
};

export type AnimalAddCompletedFormRef = {
  setValue: (value: AnimalAddInput) => void;
  isChanged: () => boolean;
};

const initialValues: AnimalAddInput = {
  age: undefined,
  comment: undefined,
  diseaseIds: undefined,
  doctorId: undefined,
  name: undefined,
  type: undefined,
};

export const AnimalAddCompletedForm = forwardRef<AnimalAddCompletedFormRef, AnimalAddCompletedFormProps>(
  ({ className, successMessageText, submitText, onSuccess, title, ...props }, ref) => {
    const { t } = useTranslation();
    const [add, { loading }] = useMutation<AddAnimalData, AddAnimalVars>(ADD_ANIMAL);

    const { onSubmit, validate } = useMemo<Pick<FormikConfig<AnimalAddInput>, 'onSubmit' | 'validate'>>(() => {
      const { catcher } = createErrorHandlers<keyof AnimalAddInput>((code, _, error) => {
        if (code === null) {
          message.error(t(`errors.${error.message}`));
        } else {
          message.error(t(`errors.${code}`));
        }
      });
      return {
        onSubmit: (values, { resetForm }) => {
          add({ variables: { input: values as AddAnimalVars['input'] } })
            .then((res) => {
              onSuccess?.(res);
              resetForm();
              message.success(successMessageText);
            })
            .catch(catcher);
        },
        validate: (values) => {
          const errors = {} as AnimalFormErrors;
          if (isNotDefinedString(values.name)) {
            errors.name = t(`errors.is_required`);
          }
          if (isNotDefinedString(values.type)) {
            errors.type = t(`errors.is_required`);
          }
          if (!values.diseaseIds?.length) {
            errors.diseaseIds = t(`errors.is_required`);
          }
          return errors;
        },
      };
    }, [t, add, onSuccess, successMessageText]);

    const formManager = useFormik<AnimalAddInput>({
      initialValues,
      onSubmit,
      validate,
    });
    const { submitForm, setValues, values } = formManager;

    const initial = useRef(initialValues);

    useImperativeHandle(ref, () => ({
      setValue: (v) => {
        initial.current = v;
        setValues(v);
      },
      isChanged: () => !deepEqual(deepClear(values), deepClear(initial.current)),
    }));

    return (
      <div className={cn(s.root, className)}>
        <Title className={s.title}>{title}</Title>
        <AnimalForm formManager={formManager} {...props} />
        <Button type="primary" loading={loading} onClick={submitForm}>
          {submitText}
        </Button>
      </div>
    );
  }
);
