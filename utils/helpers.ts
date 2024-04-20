import {
  CustomerType,
  CustomerUpdateType,
  FemaleMeasurementCreateType,
  FemaleMeasurementType,
  MaleMeasurementCreateType,
  MaleMeasurementUpdateType,
} from "@/types";
import firestore from "@react-native-firebase/firestore";

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

export const deleteCustomer = async (customerId: string) => {
  try {
    const docRef = firestore().collection("customers").doc(customerId); // Replace with your collection name
    await docRef.delete();
  } catch (error) {
    console.error("Error deleting customer:", error);
  }
};

export const createCustomer = async (data: CustomerUpdateType) => {
  try {
    await firestore().collection("customers").add(data);
  } catch (error) {
    console.error("Error creating customer:", error);
  }
};

export const addMeasurement = async (
  measurementData: MaleMeasurementCreateType | FemaleMeasurementCreateType
) => {
  try {
    const collectionRef = firestore().collection("measurements"); // Replace with your collection name
    await collectionRef.add(measurementData);
  } catch (error) {
    console.error("Error adding measurement:", error);
  }
};

export const createMeasurement = async (
  data: MaleMeasurementCreateType | FemaleMeasurementCreateType
) => {
  try {
    await firestore().collection("measurements").add(data);
  } catch (error) {
    console.error("Error creating measurement:", error);
  }
};
