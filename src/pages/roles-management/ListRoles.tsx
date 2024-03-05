import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/inputs/Button';
import SuperAdminLayout from '../../containers/SuperAdminLayout';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import Table from '../../components/table/Table';
import { roleColumns, roles } from '../../constants/Dashboard';
import { formatDate } from '../../helpers/Data';
import AddRole from './AddRole';
import { AppDispatch } from '../../states/store';
import { useDispatch } from 'react-redux';
import { setAddRoleModal } from '../../states/features/roleSlice';

const ListRoles = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  // COLUMNS


  return (
    <SuperAdminLayout>
      <main className="p-6 flex flex-col gap-6 w-full bg-white rounded-md">
        <menu className="flex items-center gap-2 justify-between">
          <h1 className="text-lg uppercase font-semibold">Roles list</h1>
          <Button
            primary
            onClick={(e) => {
              e.preventDefault();
              dispatch(setAddRoleModal(true));
            }}
            value={
              <menu className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCirclePlus} />
                Add Role
              </menu>
            }
          />
        </menu>
        <section>
          <Table
            data={roles?.map((role, index) => {
              return {
                ...role,
                no: index + 1,
                created_at: formatDate(role?.created_at),
              };
            })}
            columns={roleColumns}
          />
        </section>
      </main>
      <AddRole />
    </SuperAdminLayout>
  );
};

export default ListRoles;
