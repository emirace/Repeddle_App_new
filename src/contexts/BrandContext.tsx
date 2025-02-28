import { createContext, PropsWithChildren, useState } from "react";
import { ICreateBrand, IBrand } from "../types/product";
import useAuth from "../hooks/useAuth";
import {
  createBrandService,
  deleteBrandService,
  fetchAdminBrandsService,
  fetchBrandsByAlphaService,
  fetchBrandsService,
  updateBrandService,
} from "../services/brand";

type ContextType = {
  brands: IBrand[];
  loading: boolean;
  error: string;
  fetchBrands: (params?: string) => Promise<boolean>;
  fetchAdminBrands: (params?: string) => Promise<boolean>;
  fetchBrandsByAlpha: (alpha: string, params?: string) => Promise<IBrand[]>;
  createBrand: (brand: ICreateBrand) => Promise<boolean>;
  updateBrand: (id: string, brand: ICreateBrand) => Promise<boolean>;
  deleteBrand: (id: string) => Promise<{ message?: string }>;
};

// Create brand context
export const BrandContext = createContext<ContextType | undefined>(undefined);

export const BrandProvider = ({ children }: PropsWithChildren) => {
  const { setAuthErrorModalOpen } = useAuth();
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (error: any) => {
    setLoading(false);

    // Check if the error indicates an invalid or expired token
    if (error === "Token expired" || error === "Invalid token") {
      setError("");
      // Set the state to open the auth error modal
      setAuthErrorModalOpen(true);
    } else {
      setError(error || "An error occurred.");
    }
  };

  // Function to fetch brands
  const fetchBrands = async (params?: string) => {
    try {
      setError("");
      setLoading(true);
      const result = await fetchBrandsService(params);
      setBrands(result);
      setLoading(false);
      return true;
    } catch (error) {
      handleError(error as string);
      setLoading(false);
      return false;
    }
  };

  // Function to fetch brands
  const fetchAdminBrands = async (params?: string) => {
    try {
      setError("");
      setLoading(true);
      const result = await fetchAdminBrandsService(params);
      setBrands(result);
      setLoading(false);
      return true;
    } catch (error) {
      handleError(error as string);
      setLoading(false);
      return false;
    }
  };

  const fetchBrandsByAlpha = async (alpha: string, search?: string) => {
    try {
      const result = await fetchBrandsByAlphaService(alpha, search);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const createBrand = async (brand: ICreateBrand) => {
    try {
      setError("");
      setLoading(true);
      const result = await createBrandService(brand);
      setBrands([...brands, result]);
      setLoading(false);
      return true;
    } catch (error) {
      handleError(error as string);
      setLoading(false);
      return false;
    }
  };

  const updateBrand = async (id: string, brand: ICreateBrand) => {
    try {
      setError("");
      setLoading(true);
      const result = await updateBrandService(id, brand);
      setBrands((prevBrands) =>
        prevBrands.map((p) => (p._id === id ? result : p))
      );
      setLoading(false);
      return true;
    } catch (error) {
      handleError(error as string);
      setLoading(false);
      return false;
    }
  };

  const deleteBrand = async (id: string) => {
    try {
      setError("");
      setLoading(true);
      const data = await deleteBrandService(id);
      setBrands((prevBrands) => prevBrands.filter((Brand) => Brand._id !== id));
      setLoading(false);
      return { message: data.message };
    } catch (error) {
      handleError(error as string);
      setLoading(false);
      return {};
    }
  };

  return (
    <BrandContext.Provider
      value={{
        fetchBrands,
        fetchAdminBrands,
        fetchBrandsByAlpha,
        brands,
        loading,
        error,
        createBrand,
        deleteBrand,
        updateBrand,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
};
