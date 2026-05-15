// DO NOT MODIFY THIS FILE

using System;

public static class Sorting
{
    /// <summary>
    /// Sort a list of numbers using the bubble sort algorithm.
    /// </summary>
    public static void SortArray(int[] array)
    {
        var length = array.Length;
        for (var outer = 0; outer < length; outer++)
        {
            for (var inner = 0; inner < length - 1; inner++)
            {
                if (array[inner] > array[inner + 1])
                {
                    var temp = array[inner];
                    array[inner] = array[inner + 1];
                    array[inner + 1] = temp;
                }
            }
        }
    }
}