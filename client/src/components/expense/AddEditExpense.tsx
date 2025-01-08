import { useForm } from "react-hook-form";
import { Expense } from "../../models/expense";
import { ExpenseInput } from "../../network/api";
import * as ExpensesApi from "../../network/api";
import TextInputField from "../form/TextInputField";

interface AddEditExpenseProps {
  oldExpense?: Expense;

  onDismiss: () => void;
  onExpenseSaved: (expense: Expense) => void;
}

const AddExpense = ({
  oldExpense,
  onDismiss,
  onExpenseSaved,
}: AddEditExpenseProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseInput>({
    defaultValues: {
      name: oldExpense?.name || "",
      amount: oldExpense?.amount || 0,
    },
  });

  async function onSubmit(input: ExpenseInput) {
    try {
      let expenseResponse: Expense;
      if (oldExpense) {
        expenseResponse = await ExpensesApi.updateExpense(
          oldExpense._id,
          input
        );
      } else {
        expenseResponse = await ExpensesApi.createExpense(input);
      }
      onExpenseSaved(expenseResponse);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    // <!-- Main modal -->
    <div
      id="addexpense-modal"
      aria-hidden="true"
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full d"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow ">
          {/* <!-- Modal header --> */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
            <h3 className="text-xl font-semibold text-gray-900 ">
              {oldExpense ? "Edit expense" : "Add new expense"}
            </h3>
            <button
              onClick={onDismiss}
              type="button"
              className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              data-modal-hide="authentication-modal"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* <!-- Modal body --> */}
          <div className="p-4 md:p-5">
            <form
              id="addExpenseForm"
              className="space-y-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <TextInputField
                name="name"
                label="Name"
                register={register}
                registerOptions={{ required: "Required" }}
                error={errors.name}
              />
              <TextInputField
                name="amount"
                label="Amount"
                register={register}
                registerOptions={{
                  required: "Required",
                  pattern: {
                    value: /\d+$/,
                    message: "This input is number only.",
                  },
                }}
                error={errors.amount}
              />
              <button
                type="submit"
                form="addExpenseForm"
                className="text-black bg-green-300 border border-black hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
                disabled={isSubmitting}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
