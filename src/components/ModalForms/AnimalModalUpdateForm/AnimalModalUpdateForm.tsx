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

export type AnimalModalFormProps = {
  id: string;
  className?: string;
  children: (callbacks: { open: (initialValue?: AnimalFormValues) => void; close: () => void }) => React.ReactNode;
};

export const AnimalModalUpdateForm: FC<AnimalModalFormProps> = ({ className, id, children }) => {
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

  return (
    <>
      {children({
        close: onClose,
        open: (initialValue) => {
          open();
          if (initialValue) form.current.setValue(initialValue as AnimalUpdateInput);
        },
      })}
      <Modal
        visible={visible}
        onClose={onClose}
        afterOpen={() => input.current?.focus()}
        className={cn(s.root, className)}
      >
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
