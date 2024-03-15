import { FC } from 'react';

interface BusinessAttachmentsProps {
  isOpen: boolean;
}

const BusinessAttachments: FC<BusinessAttachmentsProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <section>
      <form>BusinessAttachments</form>
    </section>
  );
};

export default BusinessAttachments;
