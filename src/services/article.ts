import api from "./api";
import { Article, ArticleData } from "../types/article";
import { getBackendErrorMessage } from "../utils/error";

export const fetchArticles = async (search?: string): Promise<Article[]> => {
  try {
    const response: { status: boolean; articles: Article[] } = await api.get(
      `/articles${search ? `?search=${search}` : ""}`
    );
    return response.articles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw getBackendErrorMessage(error);
  }
};

export const fetchArticleById = async (id: string): Promise<Article> => {
  try {
    const response: { status: boolean; article: Article } = await api.get(
      `/articles/${id}`
    );
    return response.article;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw getBackendErrorMessage(error);
  }
};

export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response: { status: boolean; categories: string[] } = await api.get(
      `/articles/categories`
    );
    return response.categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw getBackendErrorMessage(error);
  }
};

export const createArticle = async (
  articleData: ArticleData
): Promise<Article> => {
  try {
    const response: { status: boolean; article: Article } = await api.post(
      `/articles`,
      articleData
    );
    return response.article;
  } catch (error) {
    console.error("Error creating article:", error);
    throw getBackendErrorMessage(error);
  }
};

export const updateArticle = async (
  id: string,
  articleData: Partial<Article>
): Promise<void> => {
  try {
    await api.put(`/articles/${id}`, articleData);
  } catch (error) {
    console.error("Error updating article:", error);
    throw getBackendErrorMessage(error);
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  try {
    await api.delete(`/articles/${id}`);
  } catch (error) {
    console.error("Error deleting article:", error);
    throw getBackendErrorMessage(error);
  }
};
