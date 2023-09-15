import React, { FC, useRef } from 'react';
import cn from 'clsx';
import { Modal } from 'src/components/Modal';
import { DiseaseUpdateCompletedFormRef, DiseaseUpdateCompletedForm } from 'src/components/CompletedForms';
import { DiseaseFormValues } from 'src/components/Forms';
import { useOpenCloseNotMemo } from 'src/hooks/useOpenCloseNotMemo';
import { useModalPrevent } from 'src/hooks/useModalPrevent';
import { useTranslation } from 'react-i18next';
import { InputRef } from 'antd';
import { DiseaseInput } from 'src/server.types';
import s from './DiseaseModalUpdateForm.sass';

export type DiseaseModalUpdateFormProps = {
  id: string;
  className?: string;
  children: (callbacks: { open: (initialValue?: DiseaseFormValues) => void; close: () => void }) => React.ReactNode;
};

export const DiseaseModalUpdateForm: FC<DiseaseModalUpdateFormProps> = ({ className, id, children }) => {
  const form = useRef<DiseaseUpdateCompletedFormRef>();
  const input = useRef<InputRef>();
  const { t } = useTranslation();
  const [visible, { open, close }] = useOpenCloseNotMemo();
  const prevent = useModalPrevent();

  const onClose = () => {
    if (form.current?.isChanged()) {
      prevent({ onOk: close });
    } else {
      close();
    }
  };

  const initial = useRef<DiseaseInput>();

  const afterOpen = () => {
    input.current?.focus();
    if (initial.current) form.current?.setValue(initial.current);
  };

  return (
    <>
      {children({
        close: onClose,
        open: (initialValue) => {
          open();
          initial.current = initialValue;
        },
      })}
      <Modal visible={visible} onClose={onClose} afterOpen={afterOpen} className={cn(s.root, className)}>
        <DiseaseUpdateCompletedForm
          id={id}
          autoFocusElement={input}
          ref={form}
          onSuccess={close}
          title={t`components.DiseaseModalUpdateForm.title`}
          submitText={t`components.DiseaseModalUpdateForm.submit`}
          successMessageText={t`components.DiseaseModalUpdateForm.success`}
        />
      </Modal>
    </>
  );
};
