export type TUser = {
  id: number | null;
  name: string | null;
  age: number | null;
  email: string | null;
  phoneNumber: string | null;
  score: number | null;
  isActive: boolean;
  config_status: {
    name: string | null;
    title: string | null;
    description: string | null;
  };
  last_error_details: {};
};
