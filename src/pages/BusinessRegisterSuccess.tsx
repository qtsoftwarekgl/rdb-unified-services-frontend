import { useLocation } from "react-router-dom";
import Button from "../components/inputs/Button";

const BusinessRegisterSuccess = () => {
  const redirectUrl = useLocation()?.state?.redirectUrl;

  return (
    <section className="flex flex-col items-center gap-12 p-12">
      <h1 className="text-2xl font-semibold text-center">Success!!</h1>
      <h3 className="text-lg">Successfully completed all steps to register</h3>
      <img src="https://s3-alpha-sig.figma.com/img/4599/4812/fa84e33f7eaa20d291a05fce6f721251?Expires=1711324800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RNDHsr5DkfCbFp6-l8IOg-IjWRNDwKV-faG4lu6psh94N3gqAc1kUHHPHtLmRt8vZf03rA57BeevHm2RIeCMrwKev8WFCHzjk8j3yHm1oqLEuUYE6A0mDn7deZ2t6KjhtWkIa-bLji7vQAxECNxI3vmojkqe8zPW43ryG67Ya~uIc8yspN6Q0oYB7zlBU2Yby6vtKlV3plXpI52A1oPqC6T-k~tXY5q2j0YXOZGyQIPFm1FwZMBwPiUixb6pTnQ6n1vUg2H~90hf7gm2NH-VbpSdqDA7Tl4zjPXjD1cjKko~HLw5DnGqMAkRnffRrM6bD1ATDB8A7V7cWdn-ybBhJQ__" />

      <Button
        primary
        value="OK"
        route={redirectUrl ? redirectUrl : "/services"}
        className="w-40"
      />
    </section>
  );
};

export default BusinessRegisterSuccess;
