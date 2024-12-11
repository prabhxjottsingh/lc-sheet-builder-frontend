const ProblemCategoryBlock = ({ category }) => {
  const badgeColors = {
    Easy: "bg-green-600",
    Medium: "bg-yellow-600",
    Hard: "bg-red-600",
  };
  return (
    <span className={`px-2 py-1 rounded text-xs ${badgeColors[category]}`}>
      {category}
    </span>
  );
};

export default ProblemCategoryBlock;
