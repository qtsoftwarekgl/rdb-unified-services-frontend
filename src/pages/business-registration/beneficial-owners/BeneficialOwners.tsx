import { FC } from 'react';

interface BeneficialOwnersProps {
  isOpen: boolean;
}

const BeneficialOwners: FC<BeneficialOwnersProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return <section>BeneficialOwners</section>;
};

export default BeneficialOwners;
