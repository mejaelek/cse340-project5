public static class Arrays
{
    /// <summary>
    /// This function will produce an array of size 'length' starting with 'number' followed by multiples of 'number'.
    /// For example, MultiplesOf(3, 5) will result in: {3, 6, 9, 12, 15}
    /// </summary>
    /// <returns>array of doubles that are multiples of the supplied number</returns>
    public static double[] MultiplesOf(double number, int length)
    {
        // PLAN:
        // Step 1: Create a new double array of size 'length'.
        //         We know the exact size upfront, so a fixed array is appropriate.
        //
        // Step 2: Loop from index 0 up to (but not including) 'length'.
        //         At each index i, the correct multiple is number * (i + 1).
        //         For example:
        //           i=0 → number * 1 = first multiple
        //           i=1 → number * 2 = second multiple
        //           i=2 → number * 3 = third multiple  ...and so on
        //
        // Step 3: Store each computed multiple into the array at position i.
        //
        // Step 4: After the loop finishes, return the completed array.

        // Step 1: Create the result array with the requested length
        double[] result = new double[length];

        // Step 2 & 3: Fill each slot with the correct multiple
        for (int i = 0; i < length; i++)
        {
            // (i + 1) because multiples start at 1×number, not 0×number
            result[i] = number * (i + 1);
        }

        // Step 4: Return the completed array
        return result;
    }

    /// <summary>
    /// Rotate the 'data' to the right by the 'amount'. For example, if the data is
    /// <c>List{1, 2, 3, 4, 5, 6, 7, 8, 9}</c> and an amount is 5 then the list after the function runs should be
    /// <c>List{5, 6, 7, 8, 9, 1, 2, 3, 4}</c>.
    /// The value of amount will be in the range of 1 and data.Count, inclusive.
    ///
    /// Because a list is passed to this function, no return statement is necessary.
    /// The list is modified directly.
    /// </summary>
    public static void RotateListRight(List<int> data, int amount)
    {
        // PLAN:
        // "Rotate right by amount" means the last 'amount' elements move to the FRONT,
        // and the first (data.Count - amount) elements shift to the END.
        //
        // Example: data = {1,2,3,4,5,6,7,8,9}, amount = 5
        //   The last 5 elements are: {5, 6, 7, 8, 9}   ← these become the new front
        //   The first 4 elements are: {1, 2, 3, 4}      ← these become the new back
        //   Result: {5, 6, 7, 8, 9, 1, 2, 3, 4}  ✓
        //
        // Step 1: Calculate the split index.
        //         splitIndex = data.Count - amount
        //         This is where the "tail" (elements to move to front) begins.
        //
        // Step 2: Use GetRange to extract the TAIL portion
        //         (from splitIndex to the end of the list).
        //
        // Step 3: Use GetRange to extract the HEAD portion
        //         (from index 0 up to splitIndex elements).
        //
        // Step 4: Clear the original list.
        //
        // Step 5: AddRange the tail first (it becomes the new front).
        //
        // Step 6: AddRange the head second (it becomes the new back).
        //
        // Note: We modify the list in place — no return value needed.

        // Step 1: Find where the tail starts
        int splitIndex = data.Count - amount;

        // Step 2: Grab the tail — these elements will move to the front
        List<int> tail = data.GetRange(splitIndex, amount);

        // Step 3: Grab the head — these elements will move to the back
        List<int> head = data.GetRange(0, splitIndex);

        // Step 4: Clear the list so we can rebuild it in the new order
        data.Clear();

        // Step 5: Put the tail first (now the front of the rotated list)
        data.AddRange(tail);

        // Step 6: Put the head last (now the back of the rotated list)
        data.AddRange(head);
    }
}