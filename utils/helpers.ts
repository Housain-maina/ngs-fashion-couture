import { CustomerType, CustomerUpdateType } from "@/types";
import firestore from "@react-native-firebase/firestore";

export const addCustomer = async (customerData: CustomerUpdateType) => {
  try {
    const collectionRef = firestore().collection("customers"); // Replace with your collection name
    await collectionRef.add(customerData);
  } catch (error) {
    console.error("Error adding customer:", error);
  }
};

export const updateCustomer = async (
  customerId: string,
  updatedData: Partial<CustomerUpdateType>
) => {
  try {
    const docRef = firestore().collection("customers").doc(customerId); // Replace with your collection name
    await docRef.update(updatedData);
  } catch (error) {
    console.error("Error updating customer:", error);
  }
};
