import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modal';
import { AppDispatch, RootState } from '../../states/store';
import {
  setAddPermissionModal,
  setSelectedPermissions,
  updateSelectedPermissions,
} from '../../states/features/permissionSlice';
import { setAddRoleModal } from '../../states/features/roleSlice';
import Table from '../../components/table/Table';
import { permissions } from '../../constants/Dashboard';
import { formatDate } from '../../helpers/Strings';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faX } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/inputs/Button';

const SelectPermissions = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { addPermissionModal, selectedPermissions } = useSelector(
    (state: RootState) => state.permission
  );

  // COLUMNS
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
      header: 'Added By',
      accessorKey: 'user_name',
      filter: true,
    },
    {
      header: 'Date Added',
      accessorKey: 'created_at',
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }) => {
        return (
          <menu className="flex items-center gap-2">
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
                if (
                  selectedPermissions?.find(
                    (permission) => permission?.id === row?.original?.id
                  )
                ) {
                  dispatch(
                    setSelectedPermissions(
                      selectedPermissions?.filter(
                        (permission) => permission?.id !== row?.original?.id
                      )
                    )
                  );
                } else {
                  dispatch(updateSelectedPermissions(row?.original));
                }
              }}
              icon={
                selectedPermissions?.find(
                  (permission) => permission?.id === row?.original?.id
                )
                  ? faCircleCheck
                  : faPlus
              }
              className="text-primary cursor-pointer ease-in-out duration-300 hover:scale-[1.01] p-[6px] px-[7px] text-[14px] flex items-center justify-center rounded-full"
            />
          </menu>
        );
      },
    },
  ];

  return (
    <Modal
      isOpen={addPermissionModal}
      onClose={() => {
        dispatch(setAddPermissionModal(false));
        dispatch(setAddRoleModal(true));
      }}
      mainClassName='!z-[20000]'
    >
      <section className="p-6 flex flex-col gap-3">
        <Table
          data={permissions?.map((permission, index) => {
            return {
              ...permission,
              no: index + 1,
              created_at: formatDate(permission?.created_at),
            };
          })}
          columns={columns}
          showFilter={false}
        />
        <menu className="flex items-center flex-wrap gap-3">
          {selectedPermissions?.map((permission, index) => {
            return (
              <Button
                styled={false}
                key={index}
                value={
                  <menu className="flex items-center gap-1 p-1 rounded-md bg-secondary">
                    <p className="text-[14px] text-white">{permission?.name}</p>
                    <FontAwesomeIcon
                      className="text-secondary bg-white p-[2px] px-[3px] rounded-full text-[8px]"
                      icon={faX}
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(
                          setSelectedPermissions(
                            selectedPermissions?.filter(
                              (p) => p?.id !== permission?.id
                            )
                          )
                        );
                      }}
                    />
                  </menu>
                }
              />
            );
          })}
        </menu>
        <Button
          primary
          value="Complete"
          className="flex items-center justify-center max-w-[30%] mx-auto"
          onClick={(e) => {
            e.preventDefault();
            dispatch(setAddPermissionModal(false));
          }}
        />
      </section>
    </Modal>
  );
};

export default SelectPermissions;
