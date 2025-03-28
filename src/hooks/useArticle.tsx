import { useContext } from "react";
import { ArticleContext } from "../contexts/ArticleContext";

const useArticle = () => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error("useArticle must be used within an AuthProvider");
  }
  return context;
};

export default useArticle;
