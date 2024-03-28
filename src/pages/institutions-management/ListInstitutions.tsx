import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/inputs/Button';
import Table from '../../components/table/Table';
import SuperAdminLayout from '../../containers/SuperAdminLayout';
import { capitalizeString, formatDate } from '../../helpers/strings';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { institutions } from '../../constants/dashboard';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../states/store';
import { setAddInstitutionModal, setEditInstitutionModal, setInstitution, setInstitutionsList } from '../../states/features/institutionSlice';
import AddInstitution from './AddInstitution';
import { useEffect } from 'react';
import EditInstitution from './EditInstitution';

const ListInstitutions = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { institutionsList } = useSelector(
    (state: RootState) => state.institution
  );

  // UPDATE INSTITUTIONS LIST
  useEffect(() => {
    dispatch(setInstitutionsList(institutions));
  }, [dispatch]);

  const columns = [
    {
      header: 'No',
      id: 'no',
      accessorKey: 'no',
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Type',
      accessorKey: 'type',
      filter: true,
    },
    {
      header: 'Date Added',
      accessorKey: 'created_at',
    },
    {
      header: '',
      accessorKey: 'actions',
      cell: ({ row }) => {
        return (
          <menu className="flex items-center gap-4">
            <FontAwesomeIcon
              className="text-primary text-[20px] cursor-pointer ease-in-out duration-200 hover:scale-[1.02]"
              icon={faPenToSquare}
              onClick={(e) => {
                e.preventDefault();
                dispatch(setInstitution(row?.original));
                dispatch(setEditInstitutionModal(true));
              }}
            />
          </menu>
        );
      },
    },
  ];

  return (
    <SuperAdminLayout>
      <main className="p-6 flex flex-col gap-6 w-full bg-white rounded-md">
        <menu className="w-full flex items-center gap-6 justify-between px-2">
          <h1 className="text-lg font-semibold uppercase text-primary">
            Institutions List
          </h1>
          <Button
            primary
            value={
              <menu className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} />
                New Institution
              </menu>
            }
            onClick={(e) => {
              e.preventDefault();
              dispatch(setAddInstitutionModal(true));
            }}
          />
        </menu>
        <section className="p-2">
          <Table
            data={institutionsList?.map((institution, index) => {
              return {
                ...institution,
                no: index + 1,
                name: institution?.name,
                email: institution?.email,
                type: capitalizeString(institution?.type),
                created_at: formatDate(institution?.created_at),
              };
            })}
            columns={columns}
          />
        </section>
        <AddInstitution />
        <EditInstitution />
      </main>
    </SuperAdminLayout>
  );
};

export default ListInstitutions;
