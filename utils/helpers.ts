import client from "@/sanityClient";
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
    await client
      .patch(customerId)
      .set({ ...updatedData })
      .commit();
  } catch (error) {
    console.error("Error updating customer:", error);
  }
};

export const deleteCustomer = async (customerId: string) => {
  try {
    await client.delete(customerId);
  } catch (error) {
    console.error("Error deleting customer:", error);
  }
};

export const createCustomer = async (data: CustomerUpdateType) => {
  try {
    await client.create({
      _type: "customer",
      names: data?.names,
      gender: data?.gender,
      phoneNumber: data?.phoneNumber,
    });
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

export const getCustomer = async (customerId: string) => {
  const customer = await firestore()
    .collection("customers")
    .doc(customerId)
    .get();
  if (customer) {
    return customer.data();
  }
  return null;
};

export const getMeasurement = (customerId: string) => {
  const query = firestore()
    .collection("measurements")
    .where("customerId", "==", customerId);

  query
    .get()
    .then(querySnapshot => {
      if (querySnapshot.size > 0) {
        return querySnapshot.docs[0].data();
      } else {
        return null;
      }
    })
    .catch(error => {
      console.error("Error getting documents:", error);
    });

  // return data;
};
