import Button from '@/components/inputs/Button';
import { formatDate } from '@/helpers/strings';
import { RootState } from '@/states/store';
import { useSelector } from 'react-redux';

type NameReservationProps = {
  entryId: string;
};

const NameReservationSuccess = ({ entryId }: NameReservationProps) => {
  // STATE VARIABLES
  const { user_applications } = useSelector(
    (state: RootState) => state.userApplication
  );

  const reservedName = user_applications?.find(
    (application: { entryId: string }) => application?.entryId === entryId
  );

  return (
    <section className="flex flex-col gap-4 items-center">
      <h1 className="flex gap-1 text-center">
        We have received your name reservation for {reservedName?.name}{' '}
        application successfully.
      </h1>

      <p className="text-center text-[14px]">
        The name will be reserved for three months (expiring on{' '}
        {formatDate(reservedName?.createdAt)}) extendable to another three
        months only once. After that period expires and the name has not been
        utilized, it will be released again for public usage. You will receive a
        reminder notification 10 days before the expiry date in your email
        inbox.
      </p>
      <menu className="my-4">
        <Button value={'Continue'} route="/services" primary />
      </menu>
    </section>
  );
};

export default NameReservationSuccess;
