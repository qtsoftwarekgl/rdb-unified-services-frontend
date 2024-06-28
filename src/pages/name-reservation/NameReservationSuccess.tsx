import Button from '@/components/inputs/Button';
import moment from 'moment';

const NameReservationSuccess = () => {
  return (
    <section className="flex flex-col gap-4 items-center">
      <h1 className="flex gap-1 text-center">
        We have received your name reservation application successfully.
      </h1>

      <p className="text-center text-[14px]">
        The name will be reserved for three months{' '}
        <span className="font-semibold text-[14px]">
          {moment().add(3, 'M').format('YYYY-MM-DD')}
        </span>{' '}
        extendable to another three months only once. After that period expires
        and the name has not been utilized, it will be released again for public
        usage. You will receive a reminder notification 10 days before the
        expiry date in your email inbox.
      </p>
      <menu className="my-4">
        <Button value={'Continue'} route="/services" primary />
      </menu>
    </section>
  );
};

export default NameReservationSuccess;
