type Props = {
  isOpen: boolean;
};

const OwnerDetails = ({ isOpen }: Props) => {
  if (!isOpen) return null;

  return (
    <div>
      <h1>Owner Details</h1>
    </div>
  );
};

export default OwnerDetails;
