// DO NOT MODIFY THIS FILE

using Microsoft.VisualStudio.TestTools.UnitTesting;

[TestClass]
public class Arrays_Tests
{
    [TestMethod]
    // Scenario: Create an array of multiples of 3, starting at 3, with 5 items
    // Expected Result: [3, 6, 9, 12, 15]
    // Defect(s) Found: 
    public void TestMultiplesOf3()
    {
        double[] result = Arrays.MultiplesOf(3, 5);
        Assert.AreEqual(5, result.Length);
        Assert.AreEqual(3, result[0]);
        Assert.AreEqual(6, result[1]);
        Assert.AreEqual(9, result[2]);
        Assert.AreEqual(12, result[3]);
        Assert.AreEqual(15, result[4]);
    }

    [TestMethod]
    // Scenario: Create an array of multiples of 1.5, starting at 1.5, with 4 items
    // Expected Result: [1.5, 3.0, 4.5, 6.0]
    // Defect(s) Found: 
    public void TestMultiplesOf1_5()
    {
        double[] result = Arrays.MultiplesOf(1.5, 4);
        Assert.AreEqual(4, result.Length);
        Assert.AreEqual(1.5, result[0]);
        Assert.AreEqual(3.0, result[1]);
        Assert.AreEqual(4.5, result[2]);
        Assert.AreEqual(6.0, result[3]);
    }

    [TestMethod]
    // Scenario: Create an array of multiples of 7, starting at 7, with 1 item
    // Expected Result: [7]
    // Defect(s) Found: 
    public void TestMultiplesOf7()
    {
        double[] result = Arrays.MultiplesOf(7, 1);
        Assert.AreEqual(1, result.Length);
        Assert.AreEqual(7, result[0]);
    }

    [TestMethod]
    // Scenario: Rotate a list of [1, 2, 3, 4, 5, 6, 7, 8, 9] by 5
    // Expected Result: [5, 6, 7, 8, 9, 1, 2, 3, 4]
    // Defect(s) Found: 
    public void TestRotateListRight1()
    {
        var data = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9 };
        Arrays.RotateListRight(data, 5);
        Assert.AreEqual(9, data.Count);
        Assert.AreEqual(5, data[0]);
        Assert.AreEqual(6, data[1]);
        Assert.AreEqual(7, data[2]);
        Assert.AreEqual(8, data[3]);
        Assert.AreEqual(9, data[4]);
        Assert.AreEqual(1, data[5]);
        Assert.AreEqual(2, data[6]);
        Assert.AreEqual(3, data[7]);
        Assert.AreEqual(4, data[8]);
    }

    [TestMethod]
    // Scenario: Rotate a list of [1, 2, 3, 4, 5, 6, 7, 8, 9] by 3
    // Expected Result: [7, 8, 9, 1, 2, 3, 4, 5, 6]
    // Defect(s) Found: 
    public void TestRotateListRight2()
    {
        var data = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9 };
        Arrays.RotateListRight(data, 3);
        Assert.AreEqual(9, data.Count);
        Assert.AreEqual(7, data[0]);
        Assert.AreEqual(8, data[1]);
        Assert.AreEqual(9, data[2]);
        Assert.AreEqual(1, data[3]);
        Assert.AreEqual(2, data[4]);
        Assert.AreEqual(3, data[5]);
        Assert.AreEqual(4, data[6]);
        Assert.AreEqual(5, data[7]);
        Assert.AreEqual(6, data[8]);
    }

    [TestMethod]
    // Scenario: Rotate a list of [1, 2, 3, 4, 5, 6, 7, 8, 9] by 1
    // Expected Result: [9, 1, 2, 3, 4, 5, 6, 7, 8]
    // Defect(s) Found: 
    public void TestRotateListRight3()
    {
        var data = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9 };
        Arrays.RotateListRight(data, 1);
        Assert.AreEqual(9, data.Count);
        Assert.AreEqual(9, data[0]);
        Assert.AreEqual(1, data[1]);
        Assert.AreEqual(2, data[2]);
        Assert.AreEqual(3, data[3]);
        Assert.AreEqual(4, data[4]);
        Assert.AreEqual(5, data[5]);
        Assert.AreEqual(6, data[6]);
        Assert.AreEqual(7, data[7]);
        Assert.AreEqual(8, data[8]);
    }

    [TestMethod]
    // Scenario: Rotate a list of [1, 2, 3, 4, 5, 6, 7, 8, 9] by 9 (full rotation)
    // Expected Result: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    // Defect(s) Found: 
    public void TestRotateListRight4()
    {
        var data = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9 };
        Arrays.RotateListRight(data, 9);
        Assert.AreEqual(9, data.Count);
        Assert.AreEqual(1, data[0]);
        Assert.AreEqual(2, data[1]);
        Assert.AreEqual(3, data[2]);
        Assert.AreEqual(4, data[3]);
        Assert.AreEqual(5, data[4]);
        Assert.AreEqual(6, data[5]);
        Assert.AreEqual(7, data[6]);
        Assert.AreEqual(8, data[7]);
        Assert.AreEqual(9, data[8]);
    }
}