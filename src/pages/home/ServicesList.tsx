import { ErrorResponse, Link, useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/Input';
import Navbar from '../../containers/Navbar';
import { useEffect, useRef, useState } from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useLazyFetchServicesQuery } from '@/states/api/coreApiSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setServicesList } from '@/states/features/serviceSlice';
import { toast } from 'react-toastify';
import { Accordion } from '@radix-ui/react-accordion';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/Accordion';
import { Service } from '@/types/models/service';
import { capitalizeString } from '@/helpers/strings';
import Loader from '@/components/Loader';

const ServicesList = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { servicesList } = useSelector((state: RootState) => state.service);
  const [serviceCategory, setServiceCategory] = useState<string>('business');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // DOM REFERENCES
  const accordionsRef = useRef<Array<HTMLButtonElement | null>>([]);

  // NAVIGATION
  const navigate = useNavigate();

  // INITIALIZE FETCH SERVICES QUERY
  const [
    fetchServices,
    {
      data: servicesData,
      isLoading: servicesIsLoading,
      error: servicesError,
      isError: servicesIsError,
      isSuccess: servicesIsSuccess,
    },
  ] = useLazyFetchServicesQuery();

  // FETCH SERVICES
  useEffect(() => {
    fetchServices({ category: serviceCategory });
  }, [fetchServices, serviceCategory]);

  // HANDLE FETCH SERVICES RESPONSE
  useEffect(() => {
    if (servicesIsError) {
      if ((servicesError as ErrorResponse)?.status === 500) {
        toast.error(
          'An error occurred while fetching services. Please try again later.'
        );
      } else {
        toast.error((servicesError as ErrorResponse)?.data?.message);
      }
    } else if (servicesIsSuccess) {
      if (servicesData?.data?.data?.length) {
        const groupedData = servicesData?.data?.data.reduce(
          (
            acc: {
              [section: string]: Service[];
            },
            item: Service
          ) => {
            const { section } = item;
            if (!acc[section]) {
              acc[section] = [];
            }
            acc[section].push(item);
            return acc;
          },
          {}
        );
        dispatch(
          setServicesList(
            Object.keys(groupedData).map((section) => ({
              section,
              items: groupedData[section],
            }))
          )
        );
      } else dispatch(setServicesList([]));
    }
  }, [
    servicesIsSuccess,
    servicesData,
    dispatch,
    servicesIsError,
    servicesError,
  ]);

  const categoryTabs = [
    {
      no: 1,
      name: 'Business Registration Services',
      category: 'business',
    },
    {
      no: 2,
      name: 'Mortgage Registration Services',
      category: 'mortgage',
    },
  ];

  return (
    <main className="relative">
      <Navbar className="!w-full !left-0 !px-12" />
      <section className="absolute w-full h-full top-[2vh]">
        <section className="flex flex-col items-center justify-center gap-6 py-32 bg-primary">
          <article className="flex flex-col items-center justify-center gap-6 w-[40%]">
            <h1 className="text-white font-semibold text-3xl">
              Register your business in a click!
            </h1>
            <Input
              prefixIcon={faSearch}
              className="self-center !rounded-lg !py-[10px] !px-8 !border-none focus:!shadow-xl !ps-10"
              labelClassName="flex items-center justify-center w-full"
              type="text"
              placeholder="Search service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </article>
        </section>
        <section className="max-w-[1500px] p-8 mx-auto">
          <nav className="flex items-center gap-4 max-md:flex-col">
            {categoryTabs.map((tab, index) => {
              const selected = tab.category === serviceCategory;
              return (
                <Link
                  key={index}
                  to={'#'}
                  className={`w-1/2 max-md:w-full rounded text-center p-4 py-3 font-medium ${
                    selected
                      ? 'bg-primary text-white shadow-xl'
                      : 'border border-primary'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setServiceCategory(tab.category);
                  }}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>
          <menu className="flex flex-col gap-6 items-center w-full my-4 p-2">
            {servicesIsLoading ? (
              <figure className="h-[40%] flex items-center justify-center">
                <Loader />
              </figure>
            ) : (
              servicesList?.length &&
              servicesList.map((service: Service, index: number) => {
                return (
                  <Accordion
                    key={index}
                    type="single"
                    defaultValue={`item-${index + 1}`}
                    collapsible
                    className="w-full"
                  >
                    <AccordionItem
                      value={`item-${index + 1}`}
                      className="w-full"
                    >
                      <AccordionTrigger
                        ref={(ref) => (accordionsRef.current[index] = ref)}
                        id={`accordion-${index + 1}`}
                        className="text-xl font-bold w-full"
                      >
                        {capitalizeString(service?.section)}
                      </AccordionTrigger>
                      <AccordionContent className="w-full border-none">
                        <menu className="w-full grid grid-cols-1 gap-6 p-4 px-2 mb-8 md:grid-cols-2 lg:grid-cols-3">
                          {service?.items.map(
                            (item: Service, index: number) => {
                              return (
                                <Link
                                  className="w-full text-[15px]"
                                  key={index}
                                  to={'#'}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (
                                      [
                                        '/business-registration',
                                        '/foreign-company-registration',
                                        '/enterprise-registration',
                                      ].includes(item.path)
                                    ) {
                                      navigate(`${item?.id}/new`);
                                    } else {
                                      navigate(`${item?.path}`);
                                    }
                                  }}
                                >
                                  {capitalizeString(item.name)}
                                </Link>
                              );
                            }
                          )}
                        </menu>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              })
            )}
          </menu>
          {servicesIsSuccess && servicesList.length === 0 && (
            <main className="flex justify-center items-center flex-col w-full mx-auto rounded-md p-12 mt-12  max-w-[600px] border-primary">
              <h1 className="text-2xl text-red-500">Service Not Found!</h1>
            </main>
          )}
        </section>
      </section>
    </main>
  );
};

export default ServicesList;
