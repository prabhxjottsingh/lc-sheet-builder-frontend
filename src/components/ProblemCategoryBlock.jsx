import { badgeColors } from "@/utils/constants";

const ProblemCategoryBlock = ({ category }) => {
  return (
    <span className={`px-2 py-1 rounded text-xs ${badgeColors[category]}`}>
      {category}
    </span>
  );
};

export default ProblemCategoryBlock;
