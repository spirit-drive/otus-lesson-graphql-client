import React, { FC, useRef } from 'react';
import cn from 'clsx';
import { Modal } from 'src/components/Modal';
import { AnimalUpdateCompletedFormRef, AnimalUpdateCompletedForm } from 'src/components/CompletedForms';
import { AnimalFormValues } from 'src/components/Forms';
import { useOpenCloseNotMemo } from 'src/hooks/useOpenCloseNotMemo';
import { useModalPrevent } from 'src/hooks/useModalPrevent';
import { useTranslation } from 'react-i18next';
import { InputRef } from 'antd';
import { AnimalUpdateInput } from 'src/server.types';
import s from './AnimalModalUpdateForm.sass';

export type AnimalModalUpdateFormProps = {
  id: string;
  className?: string;
  children: (callbacks: { open: (initialValue?: AnimalFormValues) => void; close: () => void }) => React.ReactNode;
};

export const AnimalModalUpdateForm: FC<AnimalModalUpdateFormProps> = ({ className, id, children }) => {
  const form = useRef<AnimalUpdateCompletedFormRef>();
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

  const initial = useRef<AnimalUpdateInput>();

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
        <AnimalUpdateCompletedForm
          id={id}
          autoFocusElement={input}
          ref={form}
          onSuccess={close}
          title={t`components.AnimalModalUpdateForm.title`}
          submitText={t`components.AnimalModalUpdateForm.submit`}
          successMessageText={t`components.AnimalModalUpdateForm.success`}
        />
      </Modal>
    </>
  );
};
