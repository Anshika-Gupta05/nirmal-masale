export default function ProductLoading() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="h-4 w-64 bg-nirmal-dark/5 rounded animate-pulse mb-8" />
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="h-96 lg:h-[500px] bg-nirmal-dark/5 rounded-2xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-9 w-3/4 bg-nirmal-dark/5 rounded animate-pulse" />
          <div className="h-4 w-1/3 bg-nirmal-dark/5 rounded animate-pulse" />
          <div className="h-24 w-full bg-nirmal-dark/5 rounded animate-pulse" />
          <div className="h-24 w-full bg-nirmal-dark/5 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}