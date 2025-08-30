import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import { getColor } from "../../util/helper";

interface UserChartProps {
  totals: Array<[string, number]>;
  currency?: string;
}

const UserChart = ({ totals, currency }: UserChartProps) => {
  Chart.register(ArcElement);
  const colors = totals.map((_e, i) => getColor(i, totals.length));
  // const tailwindColors = totals.map((_e, i) =>
  //   getTailwindColor(i, totals.length)
  // );
  const colorClasses = [
    "badge border-0 bg-blue-500",
    "badge border-0 bg-green-500",
    "badge border-0 bg-yellow-500",
    "badge border-0 bg-purple-500",
    "badge border-0 bg-pink-500",
    "badge border-0 bg-red-500",
    "badge border-0 bg-indigo-500",
  ];
  //tailwindColors.map((c) => `badge border-0 bg-${c}-500`);
  const data = {
    labels: totals.map((i) => i[0]),
    datasets: [
      {
        label: "Total by user",
        data: totals.map((i) => i[1]),
        backgroundColor: colors,
        borderColor: colors,
      },
    ],
  };
  const options = {};
  return (
    <div className="">
      <Doughnut data={data} options={options} />
      <div className="flex flex-col gap-1 pt-5">
        {totals &&
          totals.map(([name, amount], index) => (
            <div className="flex gap-2 items-center">
              <div className={colorClasses[index]}></div>
              <div className="flex justify-between grow ">
                <p className="font-medium">{name} </p>
                <p className="font-semibold">
                  {amount} {currency}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserChart;
