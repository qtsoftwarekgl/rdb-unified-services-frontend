import Button from "@/components/inputs/Button";
import moment from "moment";

const NameReservationSuccess = () => {
  return (
    <section className="flex flex-col items-center gap-4">
      <h1 className="flex gap-1 text-center">
        We have received your name reservation application successfully.
      </h1>

      <p className="text-center text-[14px]">
        When the Registrar General approves such an application, the name will
        be reserved in the company register for a period of three (3) months{" "}
        <span className="font-semibold text-[14px]">
          {moment().add(3, "M").format("YYYY-MM-DD")}
        </span>{" "}
        renewable only once upon application
      </p>
      <menu className="my-4">
        <Button value={"Continue"} route="/services" primary />
      </menu>
    </section>
  );
};

export default NameReservationSuccess;
