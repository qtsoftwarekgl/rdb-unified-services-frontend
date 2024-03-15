import { FC } from 'react';

interface PreviewSubmissionProps {
  isOpen: boolean;
}

const PreviewSubmission: FC<PreviewSubmissionProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <section>
      <form>Preview and Submission</form>
    </section>
  );
};

export default PreviewSubmission;
