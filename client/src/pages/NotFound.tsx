const NotFound = () => {
  return (
    <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 ">
      <div className="flex flex-col items-center justify-between mb-4">
        <h1>404 not found</h1>
        <p> The page you were looking for doesnt exist :(</p>
      </div>
    </div>
  );
};

export default NotFound;
