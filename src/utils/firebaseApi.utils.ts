import { useState } from "react";
import { toast } from "react-toastify";
import { addFire, deleteFile as deleteFileFire, deleteFire, getFire, getIdFire, updateFire, uploadFiles } from "./firebase.utils";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

type ControllerRef = { current: AbortController | null };

type HttpMethod = "get" | "post" | "put" | "delete";

interface FirestoreConditions {
  field: string;
  operator: any;
  value: any;
}



const FireApi = (controllerRef: ControllerRef = { current: null }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user: any = useSelector((state: RootState) => state.user.data);
  const handleError = (error: any, hideError?: boolean) => {
    let message = "Firebase Error";

    if (error?.code) {
      // Handle Firebase specific error codes
      switch (error.code) {
        case "permission-denied":
          message = "Permission denied";
          break;
        case "unauthenticated":
          message = "Unauthenticated";
        //   document.getElementById("logoutBtn")?.click();
          hideError = true;
          break;
        default:
          message = error.message || "Firebase Error";
      }
    } else if (error?.message) {
      message = error.message;
    }

    if (!hideError) toast.error(message);
    return { success: false, message };
  };

  const handleRequest = async <T = any>(
    method: HttpMethod,
    table: string,
    data: any = {},
    conditions: FirestoreConditions[] = [],
    id?: string,
    hideError = false
  ): Promise<ApiResponse<T>> => {
    setIsLoading(true);
    data.addedBy=user?.id||null

    try {
      let result: any;

      switch (method) {
        case "get":
          if (id) {
            result = await getIdFire({ table, id });
          } else {
            result = await getFire({ table, conditions });
          }
          break;

        case "post":
          result = await addFire({ table, payload: data });
          break;

        case "put":
          result = await updateFire({ table, payload: { ...data } });
          break;

        case "delete":
          if (!id) throw new Error("ID is required for delete operations");
          result = await deleteFire({ table, id });
          break;

        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      setIsLoading(false);
      return { success: true, data: result.data || result, ...result };

    } catch (error: any) {
      setIsLoading(false);
      return handleError(error, hideError);
    }
  };


  // Public API methods
  const get = <T = any>(
    table: string,
    conditions?: FirestoreConditions[],
    id?: string,
    hideError = false
  ) => handleRequest<T>("get", table, {}, conditions, id, hideError);

  const post = <T = any>(
    table: string,
    payload: Record<string, any> = {},
    hideError = false
  ) => handleRequest<T>("post", table, payload, [], undefined, hideError);

  const put = <T = any>(
    table: string,
    payload: Record<string, any> = {},
    hideError = false
  ) => handleRequest<T>("put", table, payload, [], undefined, hideError);

  const deleteApi = <T = any>(
    table: string,
    id: string,
    hideError = false
  ) => handleRequest<T>("delete", table, {}, [], id, hideError);

  // Multi-image upload would need Firebase Storage implementation
  const imageUploads =async <T = any>(
    modal: string,
    files:any[],
    hideError=false
  ) => {
    setIsLoading(true);

    try {
      let result: any;
       result = await uploadFiles(files,modal);
      setIsLoading(false);
      return { success: true, data: result.data || result, ...result };

    } catch (error: any) {
      setIsLoading(false);
      return handleError(error, hideError);
    }
  };

    const deleteFile =async <T = any>(
    path: string,
    hideError=false
  ) => {
    setIsLoading(true);
    try {
      let result: any;
       result = await deleteFileFire(path);
      setIsLoading(false);
      return { success: true, data: result?.data || result, ...result };

    } catch (error: any) {
      setIsLoading(false);
      return handleError(error, hideError);
    }
  };


  const allApi = <T = any>(
    table: string,
    params: any = {},
    method: HttpMethod = "get"
  ) => {
    const { id, conditions = [], ...payload } = params;
    
    switch (method) {
      case "get":
        return get<T>(table, conditions, id);
      case "post":
        return post<T>(table, payload);
      case "put":
        if (!id) throw new Error("ID required for put");
        return put<T>(table, id, payload);
      case "delete":
        if (!id) throw new Error("ID required for delete");
        return deleteApi<T>(table, id);
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  };

  return {
    get,
    post,
    put,
    deleteApi,
    allApi,
    imageUploads,
    deleteFile,
    isLoading,
    controller: controllerRef.current,
  };
};

export default FireApi;