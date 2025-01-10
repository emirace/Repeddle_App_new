/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUser, UpdateUser, Wishlist } from "../types/user";
import { getBackendErrorMessage } from "../utils/error";
import api from "./api";
import * as SecureStore from "expo-secure-store";

export async function sendVerifyEmailService(userData: {
  email: string;
  mode: string;
}): Promise<any> {
  try {
    const data = await api.post("/users/send-verification-email", userData);
    if (!data.status) {
      const errorMessage = getBackendErrorMessage(data.data);
      throw new Error(errorMessage);
    }

    return data.status;
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Registration error:", error);

    const errorMessage = getBackendErrorMessage(error);
    console.error(errorMessage);
    // Re-throw the error to propagate it up the call stack if needed
    throw errorMessage;
  }
}

export async function forgetPasswordService(userData: {
  email: string;
}): Promise<any> {
  try {
    console.log(userData, "body");
    const data = await api.post("/users/forgot-password", userData);

    if (!data.status) {
      const errorMessage = getBackendErrorMessage(data.data);
      throw new Error(errorMessage);
    }

    return data.status;
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("forget password error:", error);

    const errorMessage = getBackendErrorMessage(error);
    console.error(errorMessage);
    // Re-throw the error to propagate it up the call stack if needed
    throw errorMessage;
  }
}

export async function verifyEmailService(tokenData: {
  token: string;
  mode: string;
}): Promise<any> {
  try {
    const data = await api.get(
      `/users/verify-email/${tokenData.token}?mode=${tokenData.mode}`
    );
    console.log(data);

    if (!data.status) {
      const errorMessage = getBackendErrorMessage(data.data);
      throw new Error(errorMessage);
    }

    return data.status;
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Registration error:", error);

    const errorMessage = getBackendErrorMessage(error);
    console.error(errorMessage);
    // Re-throw the error to propagate it up the call stack if needed
    throw errorMessage;
  }
}

export async function registerUserService(credentials: {
  token: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}): Promise<any> {
  try {
    const data = await api.post("/users/register", credentials);

    if (!data.status) {
      const errorMessage = getBackendErrorMessage(data.data);
      throw new Error("Registration failed: " + errorMessage);
    }

    return data.status;
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Registration error:", error);

    const errorMessage = getBackendErrorMessage(error);

    // Re-throw the error to propagate it up the call stack if needed
    throw errorMessage;
  }
}

export async function loginUser(credentials: {
  email: string;
  password: string;
}): Promise<string> {
  try {
    const data: any = await api.post("/users/login", credentials);

    if (!data.status) {
      // Handle login error, e.g., display an error message to the user
      throw new Error("Login failed: " + getBackendErrorMessage(data.data));
    }

    await SecureStore.setItemAsync("authToken", data.token);

    return data.token;
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Login error:", getBackendErrorMessage(error));

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error);
  }
}

export async function getUserService(): Promise<IUser> {
  try {
    const data: any = await api.get("/users/profile");

    if (!data.status) {
      // Handle login error, e.g., display an error message to the user
      throw new Error("Login failed: " + getBackendErrorMessage(data.data));
    }

    await SecureStore.setItemAsync("email", data.user.email);
    await SecureStore.setItemAsync("username", data.user.username);
    return data.user;
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Get user error:", getBackendErrorMessage(error));

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error);
  }
}

export async function getSuggestUsernameService(body: {
  firstName: string;
  lastName: string;
  otherText?: string;
}): Promise<string[]> {
  try {
    const data: { status: true; suggestedUsernames: string[] } = await api.post(
      "/users/suggested-username",
      body
    );

    if (!data.status) {
      // Handle suggests error, e.g., display an error message to the user
      throw new Error(
        "Suggest username failed: " + getBackendErrorMessage(data)
      );
    }

    return data.suggestedUsernames;
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Get user error:", getBackendErrorMessage(error));

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error);
  }
}

export async function unFollowUserService(userId: string): Promise<string> {
  try {
    const data: { message: string; status: boolean } = await api.delete(
      `/users/unfollow/${userId}`
    );

    // if (!data.status) {
    //   // Handle unfollow user error, e.g., display an error message to the user
    //   throw new Error("unFollow user failed: " + getBackendErrorMessage(data));
    // }

    return data.message;
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("unFollow user error:", getBackendErrorMessage(error));

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error);
  }
}

export async function followUserService(userId: string): Promise<string> {
  try {
    const data: { message: string; status: boolean } = await api.post(
      `/users/follow/${userId}`
    );

    // if (!data.status) {
    //   // Handle follow user error, e.g., display an error message to the user
    //   throw new Error("Follow user failed: " + getBackendErrorMessage(data))
    // }

    return data.message;
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Follow user error:", getBackendErrorMessage(error));

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error);
  }
}

export async function updateUserService(userData: UpdateUser): Promise<IUser> {
  try {
    const response: any = await api.put("/users/profile", userData);

    console.log(response);
    if (!response.status) {
      // Handle login error, e.g., display an error message to the user
      throw new Error(
        "Update failed: " + getBackendErrorMessage(response.data)
      );
    }

    return response.user;
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Update user error:", getBackendErrorMessage(error));

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error);
  }
}

export async function logoutUser(): Promise<void> {
  try {
    const { data } = await api.get("/users/logout");

    if (!data.status) {
      // Handle logout error, e.g., display an error message to the user
      throw new Error("Logout failed: " + getBackendErrorMessage(data.data));
    }

    SecureStore.deleteItemAsync("authToken");
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Logout error:", getBackendErrorMessage(error));

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error);
  }
}

export async function deleteUserService(id: string): Promise<void | boolean> {
  try {
    const { data } = await api.delete(`/users/${id}`);

    if (!data.status) {
      // Handle logout error, e.g., display an error message to the user
      throw new Error(
        "Delete user failed: " + getBackendErrorMessage(data.data)
      );
    }
    return true;
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Logout error:", getBackendErrorMessage(error));

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error);
  }
}

export async function resetUserPasswordService(
  password: string,
  token: string
): Promise<void | boolean> {
  try {
    const data = await api.post(`/users/reset-password/${token}`, {
      password,
    });

    if (!data.status) {
      // Handle reset error, e.g., display an error message to the user
      throw new Error(
        "Password change failed: " + getBackendErrorMessage(data.data)
      );
    }
    return true;
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Password change error:", getBackendErrorMessage(error));

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error);
  }
}

export async function addToWishlistService(productId: string) {
  try {
    const data: {
      status: boolean;
      message: string;
      wishlist: IUser["wishlist"];
    } = await api.post(`/users/wishlist`, {
      productId,
    });

    if (!data.status) {
      // Handle add to wishlist error, e.g., display an error message to the user
      throw new Error(
        "add to wishlist failed: " + getBackendErrorMessage(data)
      );
    }
    return data;
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("add to wishlist error:", getBackendErrorMessage(error));

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error);
  }
}

export async function removeFromWishlistService(productId: string) {
  try {
    const data: {
      status: boolean;
      message: string;
      wishlist: IUser["wishlist"];
    } = await api.delete(`/users/wishlist/${productId}`);

    if (!data.status) {
      // Handle add to wishlist error, e.g., display an error message to the user
      throw new Error(
        "add to wishlist failed: " + getBackendErrorMessage(data)
      );
    }
    return data;
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("add to wishlist error:", getBackendErrorMessage(error));

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error);
  }
}

// You can add more authentication-related functions here, such as checking the user's authentication status, resetting passwords, etc.

export async function getWishlistService() {
  try {
    const data: { wishlist: Wishlist[]; status: boolean } = await api.get(
      `/users/wishlist`
    );

    if (!data.status) {
      // Handle all users wishlist error, e.g., display an error message to the user
      throw new Error(
        "Get all wishlist failed: " + getBackendErrorMessage(data)
      );
    }

    return data.wishlist;
  } catch (error) {
    // Handle network errors or other exceptions
    // You can log the error or perform other error-handling actions
    console.error("Get user wishlist error:", getBackendErrorMessage(error));

    // Re-throw the error to propagate it up the call stack if needed
    throw getBackendErrorMessage(error);
  }
}
