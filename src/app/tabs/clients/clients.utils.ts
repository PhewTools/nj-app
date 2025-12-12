export interface Client {
  id: string;
  name: string;
  lastname: string;
  address: string;
  email: string;
  birth_date: Date;
  phone_number: string
  last_visit?: Date;
}