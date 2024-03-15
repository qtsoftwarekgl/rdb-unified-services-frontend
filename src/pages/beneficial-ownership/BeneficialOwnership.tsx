import UserLayout from "../../containers/UserLayout";

const BeneficialOwnership = () => {
  return (
    <UserLayout>
      <section className="flex flex-col gap-4">
        <menu className="px-8 py-3 text-white rounded-md max-sm:w-full w-72 bg-primary">
          Beneficial Ownership
        </menu>
      </section>
    </UserLayout>
  );
};

export default BeneficialOwnership;
