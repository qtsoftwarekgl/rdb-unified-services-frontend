import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/inputs/Button';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import SuperAdminLayout from '../../containers/SuperAdminLayout';
import Table from '../../components/table/Table';
import { columns, users } from '../../constants/Users';
import { capitalizeString, formatDate } from '../../helpers/Data';

const ListUsers = () => {

  return (
    <SuperAdminLayout>
      <main className="p-6 flex flex-col gap-6 w-full bg-white rounded-md">
        <menu className="w-full flex items-center gap-6 justify-between">
          <h1 className="text-xl font-semibold">Users List</h1>
          <Button
            primary
            value={
              <menu className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCirclePlus} />
                New User
              </menu>
            }
          />
        </menu>
        <section className='p-2'>
          <Table
            data={users?.map((user, index) => {
              return {
                ...user,
                no: index + 1,
                name: `${user?.first_name} ${user?.last_name}`,
                role: capitalizeString(user?.role),
                status: capitalizeString(user?.status),
                created_at: formatDate(user?.created_at),
              };
            })}
            columns={columns}
          />
        </section>
      </main>
    </SuperAdminLayout>
  );
};

export default ListUsers;
