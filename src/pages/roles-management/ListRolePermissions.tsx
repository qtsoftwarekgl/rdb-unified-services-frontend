import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modal';
import { AppDispatch, RootState } from '../../states/store';
import { setRolePermissionsModal } from '../../states/features/roleSlice';
import Table from '../../components/table/Table';
import { formatDate } from '../../helpers/Strings';
import { permissions } from '../../constants/Dashboard';

const ListRolePermissions = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { rolePermissionsModal, role } = useSelector(
    (state: RootState) => state.role
  );

  const columns = [
    {
      header: 'No',
      accessorKey: 'no',
    },
    {
      header: 'Permission',
      accessorKey: 'name',
    },
    {
      header: 'Description',
      accessorKey: 'description',
    },
    {
      header: 'Date Added',
      accessorKey: 'created_at',
    },
  ];

  return (
    <Modal
      isOpen={rolePermissionsModal}
      onClose={() => {
        dispatch(setRolePermissionsModal(false));
      }}
    >
      <h1 className="text-lg text-secondary uppercase text-center">
        {role?.name} permissions
      </h1>
      <section className="p-6 flex flex-col gap-3">
        <Table
          data={permissions?.slice(0, 6)?.map((permission, index) => {
            return {
              ...permission,
              no: index + 1,
              created_at: formatDate(permission?.created_at),
            };
          })}
          columns={columns}
          showFilter={false}
        />
      </section>
    </Modal>
  );
};

export default ListRolePermissions;
