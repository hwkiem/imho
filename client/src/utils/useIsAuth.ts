import { useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useIsAuth = () => {
  const { data, loading } = useMeQuery();
  const router = useRouter();
  console.log(loading);
  console.log(data);
  useEffect(() => {
    if (!loading && !data?.me.users) {
      router.replace("/login?next=" + router.pathname);
    }
  }, [loading, data, router]);
};
