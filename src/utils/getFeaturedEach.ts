// import json files from the data folder in src
import { data0000,
data0001,
data0002,
data0003,
data0004,
data0005,
data0006,
data0007,
data0008,
data0009,
data0010,
data0011,
data0012,
data0013
} from "../data";
import { Bag } from "../types";




export function getFeaturedEach(): Bag[] {
// get first item from each data file
  const featuredItems: Bag[] = [];

  // Array of all data sets
  const dataSets = [
    data0000,
    data0001,
    data0002,
    data0003,
    data0004,
    data0005,
    data0006,
    data0007,
    data0008,
    data0009,
    data0010,
    data0011,
    data0012,
    data0013
  ];

  // Get first item from each dataset and push to featuredItems
  dataSets.forEach(dataSet => {
    if (dataSet && dataSet.length > 0) {
      featuredItems.push(dataSet[0]);
    }
  });

  return featuredItems;
}