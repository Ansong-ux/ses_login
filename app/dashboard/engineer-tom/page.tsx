'use client';
import React, { useState, useRef, useEffect } from 'react';

export default function EngineerTomPage() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Array<{id: string, sender: 'user' | 'ai', content: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user' as const,
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai' as const,
        content: aiResponse
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      
      // Auto-speak the response
      speakResponse(aiResponse);
    }, 1000);
  };

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    // Programming & Development
    if (lowerQuestion.includes('react') || lowerQuestion.includes('component') || lowerQuestion.includes('button')) {
      return `Here's a modern React button component with TypeScript:

\`\`\`tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      className={\`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]} \${disabledClasses} \${className}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
\`\`\`

**Usage:**
\`\`\`tsx
<Button variant="primary" size="md" onClick={() => alert('Clicked!')}>
  Click Me
</Button>
\`\`\``;
    }

    if (lowerQuestion.includes('javascript') || lowerQuestion.includes('js')) {
      return `**JavaScript Fundamentals:**

**1. Variables & Data Types:**
\`\`\`javascript
// Modern variable declarations
let name = 'John';           // Block-scoped
const age = 25;              // Immutable
var oldWay = 'avoid this';   // Function-scoped (avoid)

// Data types
const string = 'Hello';
const number = 42;
const boolean = true;
const array = [1, 2, 3];
const object = { key: 'value' };
const nullValue = null;
const undefined = undefined;
\`\`\`

**2. Functions:**
\`\`\`javascript
// Arrow functions (modern)
const add = (a, b) => a + b;
const multiply = (a, b) => {
  return a * b;
};

// Traditional function
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

**3. Array Methods:**
\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];

// Map - transform elements
const doubled = numbers.map(n => n * 2);

// Filter - select elements
const evens = numbers.filter(n => n % 2 === 0);

// Reduce - combine elements
const sum = numbers.reduce((acc, n) => acc + n, 0);
\`\`\``;
    }

    if (lowerQuestion.includes('python')) {
      return `**Python Programming - Complete Guide:**

**1. Core Python Concepts:**

**Variables & Data Types:**
\`\`\`python
# Basic data types
name = "Alice"          # String
age = 25               # Integer
height = 5.8           # Float
is_student = True      # Boolean
complex_num = 3 + 4j   # Complex number

# Collections
numbers = [1, 2, 3, 4, 5]           # List (mutable)
coordinates = (10, 20)              # Tuple (immutable)
person = {'name': 'Bob', 'age': 30} # Dictionary
unique_numbers = {1, 2, 3, 4}       # Set (unique values)
\`\`\`

**2. Advanced Functions:**
\`\`\`python
# Function with type hints
def calculate_area(length: float, width: float) -> float:
    """Calculate the area of a rectangle."""
    return length * width

# Function with default parameters
def greet(name: str, greeting: str = "Hello", punctuation: str = "!") -> str:
    return f"{greeting}, {name}{punctuation}"

# Lambda functions (anonymous functions)
square = lambda x: x ** 2
add = lambda x, y: x + y

# List comprehensions
squares = [x**2 for x in range(10)]
even_squares = [x**2 for x in range(10) if x % 2 == 0]
\`\`\`

**3. Object-Oriented Programming:**
\`\`\`python
class Student:
    def __init__(self, name: str, age: int, major: str):
        self.name = name
        self.age = age
        self.major = major
        self.courses = []
    
    def add_course(self, course: str) -> None:
        self.courses.append(course)
    
    def get_info(self) -> str:
        return f"{self.name} is {self.age} years old, studying {self.major}"
    
    def __str__(self) -> str:
        return f"Student({self.name}, {self.major})"

# Usage
student = Student("Alice", 20, "Computer Science")
student.add_course("Python Programming")
print(student.get_info())
\`\`\`

**4. File Handling & Context Managers:**
\`\`\`python
# Reading files
with open('data.txt', 'r') as file:
    content = file.read()
    lines = file.readlines()

# Writing files
with open('output.txt', 'w') as file:
    file.write("Hello, World!")

# Working with CSV
import csv
with open('data.csv', 'r') as file:
    reader = csv.DictReader(file)
    for row in reader:
        print(row['name'], row['age'])
\`\`\`

**5. Error Handling:**
\`\`\`python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")
except Exception as e:
    print(f"An error occurred: {e}")
else:
    print("No errors occurred")
finally:
    print("This always executes")
\`\`\`

**6. Popular Python Libraries:**
\`\`\`python
# Data Science
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Web Development
from flask import Flask, request, jsonify
import requests

# Machine Learning
from sklearn.linear_model import LinearRegression
import tensorflow as tf

# Automation
import os
import sys
import json
\`\`\`

**7. Best Practices:**
- Use meaningful variable names
- Write docstrings for functions and classes
- Follow PEP 8 style guidelines
- Use virtual environments for projects
- Write unit tests for your code
- Use type hints for better code documentation

**8. Common Python Patterns:**
\`\`\`python
# Decorators
def timer(func):
    def wrapper(*args, **kwargs):
        import time
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.2f} seconds")
        return result
    return wrapper

@timer
def slow_function():
    import time
    time.sleep(1)
    return "Done!"
\`\`\`

**Next Steps:**
- Practice with real projects
- Learn popular frameworks (Django, Flask, FastAPI)
- Explore data science libraries (Pandas, NumPy, Matplotlib)
- Study design patterns and best practices
- Contribute to open-source projects`;
    }

    // Database & SQL
    if (lowerQuestion.includes('sql') || lowerQuestion.includes('database') || lowerQuestion.includes('join')) {
      return `**SQL Database Guide:**

**1. Basic SELECT:**
\`\`\`sql
-- Select all columns
SELECT * FROM users;

-- Select specific columns
SELECT name, email, created_at FROM users;

-- Filter with WHERE
SELECT * FROM users WHERE age > 18;
\`\`\`

**2. JOIN Examples:**
\`\`\`sql
-- INNER JOIN (most common)
SELECT u.name, o.order_date, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.total > 100;

-- LEFT JOIN (include all from left table)
SELECT u.name, o.order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;  -- Users with no orders

-- RIGHT JOIN (include all from right table)
SELECT p.name, c.category_name
FROM products p
RIGHT JOIN categories c ON p.category_id = c.id;
\`\`\`

**3. Aggregation:**
\`\`\`sql
-- GROUP BY with aggregation
SELECT category, COUNT(*) as count, AVG(price) as avg_price
FROM products
GROUP BY category
HAVING COUNT(*) > 5;
\`\`\``;
    }

    // Networking
    if (lowerQuestion.includes('tcp') || lowerQuestion.includes('udp') || lowerQuestion.includes('network')) {
      return `**TCP vs UDP Comparison:**

**TCP (Transmission Control Protocol):**
✅ **Reliable** - Guaranteed delivery
✅ **Ordered** - Packets arrive in order
✅ **Connection-oriented** - Establishes connection first
✅ **Error checking** - Built-in error detection
❌ **Slower** - Overhead for reliability
❌ **More bandwidth** - Additional headers

**UDP (User Datagram Protocol):**
❌ **Unreliable** - No delivery guarantee
❌ **Unordered** - Packets may arrive out of order
❌ **Connectionless** - No connection establishment
❌ **No error checking** - Minimal error detection
✅ **Faster** - Less overhead
✅ **Less bandwidth** - Smaller headers

**When to Use TCP:**
- Web browsing (HTTP/HTTPS)
- Email (SMTP)
- File transfer (FTP)
- Database connections
- Any application requiring reliability

**When to Use UDP:**
- Video streaming
- Online gaming
- Voice over IP (VoIP)
- DNS queries
- Real-time applications where speed > reliability`;
    }

    if (lowerQuestion.includes('osi model') || lowerQuestion.includes('osi layers') || lowerQuestion.includes('network layers')) {
      return `**OSI Model (Open Systems Interconnection):**

**Layer 7 - Application Layer**
- HTTP, HTTPS, FTP, SMTP, DNS
- User interfaces and application services

**Layer 6 - Presentation Layer**
- Data encryption, compression, formatting
- SSL/TLS, JPEG, MPEG

**Layer 5 - Session Layer**
- Session management, authentication
- NetBIOS, RPC

**Layer 4 - Transport Layer**
- End-to-end communication, flow control
- TCP, UDP

**Layer 3 - Network Layer**
- Logical addressing, routing
- IP, ICMP, OSPF

**Layer 2 - Data Link Layer**
- Physical addressing, error detection
- Ethernet, MAC addresses

**Layer 1 - Physical Layer**
- Physical transmission of bits
- Cables, connectors, network cards

**Memory Trick:** "Please Do Not Throw Sausage Pizza Away"`;
    }

    // Mathematics & Physics
    if (lowerQuestion.includes('newton') || lowerQuestion.includes('law') || lowerQuestion.includes('physics')) {
      return `**Newton's Three Laws of Motion:**

**First Law (Law of Inertia):**
"An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force."
- Objects resist changes in their state of motion
- Inertia is the tendency to maintain current motion

**Second Law (Force Law):**
"Force equals mass times acceleration" (F = ma)
- The acceleration of an object is directly proportional to the net force
- Inversely proportional to the object's mass
- Direction of acceleration is same as net force

**Third Law (Action-Reaction):**
"For every action, there is an equal and opposite reaction."
- Forces always occur in pairs
- Action and reaction forces are equal in magnitude
- Opposite in direction
- Act on different objects

**Examples:**
- **1st Law:** Car continues moving after brakes are released
- **2nd Law:** Heavier objects need more force to accelerate
- **3rd Law:** Rocket propulsion, walking`;
    }

    if (lowerQuestion.includes('algorithm') || lowerQuestion.includes('data structure') || lowerQuestion.includes('complexity')) {
      return `**Algorithms & Data Structures:**

**Common Data Structures:**

**1. Arrays:**
- Fixed size, indexed access
- Time: O(1) access, O(n) search/insert/delete
- Space: O(n)

**2. Linked Lists:**
- Dynamic size, sequential access
- Time: O(n) access/search, O(1) insert/delete at ends
- Space: O(n)

**3. Stacks:**
- LIFO (Last In, First Out)
- Operations: push, pop, peek
- Time: O(1) for all operations

**4. Queues:**
- FIFO (First In, First Out)
- Operations: enqueue, dequeue, peek
- Time: O(1) for all operations

**5. Hash Tables:**
- Key-value pairs, fast lookup
- Time: O(1) average case, O(n) worst case
- Space: O(n)

**6. Trees:**
- Hierarchical structure
- Binary Search Tree: O(log n) search/insert/delete
- Balanced trees (AVL, Red-Black): guaranteed O(log n)

**7. Graphs:**
- Nodes connected by edges
- Adjacency Matrix: O(1) edge lookup, O(n²) space
- Adjacency List: O(degree) edge lookup, O(n + m) space`;
    }

    // System Design
    if (lowerQuestion.includes('system design') || lowerQuestion.includes('architecture') || lowerQuestion.includes('scalability')) {
      return `**System Design Principles:**

**1. Scalability:**
- **Horizontal Scaling:** Add more machines
- **Vertical Scaling:** Increase machine resources
- **Load Balancing:** Distribute traffic across servers

**2. High Availability:**
- **Redundancy:** Multiple copies of data/services
- **Failover:** Automatic switching to backup systems
- **Monitoring:** Health checks and alerting

**3. Performance:**
- **Caching:** Redis, CDN, browser caching
- **Database Optimization:** Indexing, query optimization
- **Asynchronous Processing:** Message queues, background jobs

**4. Security:**
- **Authentication:** JWT, OAuth, SSO
- **Authorization:** Role-based access control (RBAC)
- **Data Protection:** Encryption, HTTPS, input validation

**5. Common Patterns:**
- **Microservices:** Small, independent services
- **Event-Driven:** Loose coupling via events
- **CQRS:** Separate read/write models
- **API Gateway:** Single entry point for clients`;
    }

    // General Programming Concepts
    if (lowerQuestion.includes('oop') || lowerQuestion.includes('object oriented') || lowerQuestion.includes('class')) {
      return `**Object-Oriented Programming (OOP):**

**1. Four Pillars of OOP:**

**Encapsulation:**
- Bundling data and methods that operate on that data
- Information hiding through access modifiers
\`\`\`java
public class BankAccount {
    private double balance;  // Private data
    
    public void deposit(double amount) {  // Public method
        if (amount > 0) {
            balance += amount;
        }
    }
}
\`\`\`

**Inheritance:**
- Creating new classes from existing ones
- Code reuse and hierarchical relationships
\`\`\`java
public class Animal {
    protected String name;
    public void eat() { }
}

public class Dog extends Animal {
    public void bark() { }
}
\`\`\`

**Polymorphism:**
- Same interface, different implementations
- Method overriding and overloading
\`\`\`java
public interface Shape {
    double getArea();
}

public class Circle implements Shape {
    public double getArea() { return Math.PI * radius * radius; }
}

public class Rectangle implements Shape {
    public double getArea() { return width * height; }
}
\`\`\`

**Abstraction:**
- Hiding complex implementation details
- Providing simple interfaces
\`\`\`java
public abstract class Vehicle {
    abstract void startEngine();
    
    public void drive() {
        startEngine();
        // Complex driving logic hidden
    }
}
\`\`\``;
    }

    if (lowerQuestion.includes('java')) {
      return `**Java Programming - Complete Guide:**

**1. Core Java Concepts:**

**Classes & Objects:**
\`\`\`java
public class Student {
    // Instance variables (fields)
    private String name;
    private int age;
    private String major;
    
    // Constructor
    public Student(String name, int age, String major) {
        this.name = name;
        this.age = age;
        this.major = major;
    }
    
    // Getter methods
    public String getName() { return name; }
    public int getAge() { return age; }
    public String getMajor() { return major; }
    
    // Setter methods
    public void setName(String name) { this.name = name; }
    public void setAge(int age) { this.age = age; }
    public void setMajor(String major) { this.major = major; }
    
    // Method
    public String getInfo() {
        return name + " is " + age + " years old, studying " + major;
    }
    
    @Override
    public String toString() {
        return "Student{name='" + name + "', age=" + age + ", major='" + major + "'}";
    }
}
\`\`\`

**2. Collections Framework:**
\`\`\`java
import java.util.*;

// List (ordered, allows duplicates)
List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
names.add("Charlie");

// Set (no duplicates)
Set<Integer> numbers = new HashSet<>();
numbers.add(1);
numbers.add(2);
numbers.add(1); // Won't be added

// Map (key-value pairs)
Map<String, Integer> ages = new HashMap<>();
ages.put("Alice", 25);
ages.put("Bob", 30);
ages.put("Charlie", 28);

// Iterating through collections
for (String name : names) {
    System.out.println(name);
}

// Using streams (Java 8+)
names.stream()
     .filter(name -> name.startsWith("A"))
     .forEach(System.out::println);
\`\`\`

**3. Exception Handling:**
\`\`\`java
public class Calculator {
    public double divide(double a, double b) throws ArithmeticException {
        if (b == 0) {
            throw new ArithmeticException("Cannot divide by zero");
        }
        return a / b;
    }
    
    public void safeDivide(double a, double b) {
        try {
            double result = divide(a, b);
            System.out.println("Result: " + result);
        } catch (ArithmeticException e) {
            System.err.println("Error: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
        } finally {
            System.out.println("Operation completed");
        }
    }
}
\`\`\`

**4. Interfaces & Abstract Classes:**
\`\`\`java
// Interface
public interface Drawable {
    void draw();
    double getArea();
}

// Abstract class
public abstract class Shape implements Drawable {
    protected String color;
    
    public Shape(String color) {
        this.color = color;
    }
    
    public String getColor() {
        return color;
    }
}

// Concrete class
public class Circle extends Shape {
    private double radius;
    
    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }
    
    @Override
    public void draw() {
        System.out.println("Drawing a " + color + " circle with radius " + radius);
    }
    
    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }
}
\`\`\`

**5. Generics:**
\`\`\`java
// Generic class
public class Box<T> {
    private T content;
    
    public void set(T content) {
        this.content = content;
    }
    
    public T get() {
        return content;
    }
}

// Usage
Box<String> stringBox = new Box<>();
stringBox.set("Hello, World!");
String message = stringBox.get();

Box<Integer> intBox = new Box<>();
intBox.set(42);
Integer number = intBox.get();
\`\`\`

**6. Multithreading:**
\`\`\`java
// Thread class
public class MyThread extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println("Thread: " + Thread.currentThread().getName() + " - " + i);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

// Runnable interface
public class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Running in thread: " + Thread.currentThread().getName());
    }
}

// Usage
MyThread thread1 = new MyThread();
thread1.start();

Thread thread2 = new Thread(new MyRunnable());
thread2.start();
\`\`\`

**7. Java 8+ Features:**
\`\`\`java
import java.util.*;
import java.util.stream.Collectors;

// Lambda expressions
List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");

// Stream operations
List<String> filteredNames = names.stream()
    .filter(name -> name.length() > 4)
    .map(String::toUpperCase)
    .collect(Collectors.toList());

// Optional
Optional<String> optionalName = Optional.of("Alice");
String result = optionalName.orElse("Unknown");

// Method references
names.forEach(System.out::println);
\`\`\`

**8. Best Practices:**
- Follow naming conventions (camelCase for variables, PascalCase for classes)
- Use access modifiers appropriately (private, protected, public)
- Implement equals() and hashCode() for custom classes
- Use StringBuilder for string concatenation in loops
- Handle exceptions properly
- Use generics for type safety
- Write unit tests for your code

**Next Steps:**
- Learn Spring Framework for enterprise development
- Explore Android development
- Study design patterns (Singleton, Factory, Observer, etc.)
- Practice with real-world projects
- Learn about JVM internals and performance optimization`;
    }

    if (lowerQuestion.includes('c++') || lowerQuestion.includes('cpp')) {
      return `**C++ Programming - Complete Guide:**

**1. Basic Syntax & Data Types:**
\`\`\`cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

// Basic data types
int integer = 42;
double floating = 3.14159;
char character = 'A';
bool boolean = true;
string text = "Hello, World!";

// Arrays
int numbers[5] = {1, 2, 3, 4, 5};

// Vectors (dynamic arrays)
vector<int> dynamicNumbers = {1, 2, 3, 4, 5};
dynamicNumbers.push_back(6);
\`\`\`

**2. Functions & References:**
\`\`\`cpp
// Function with pass by value
int add(int a, int b) {
    return a + b;
}

// Function with pass by reference
void modifyValue(int& value) {
    value *= 2;
}

// Function with const reference (efficient for large objects)
void printVector(const vector<int>& vec) {
    for (int num : vec) {
        cout << num << " ";
    }
    cout << endl;
}

// Function overloading
int multiply(int a, int b) {
    return a * b;
}

double multiply(double a, double b) {
    return a * b;
}

// Default parameters
void greet(string name = "World", string greeting = "Hello") {
    cout << greeting << ", " << name << "!" << endl;
}
\`\`\`

**3. Classes & Objects:**
\`\`\`cpp
class Student {
private:
    string name;
    int age;
    string major;
    
public:
    // Constructor
    Student(string n, int a, string m) : name(n), age(a), major(m) {}
    
    // Copy constructor
    Student(const Student& other) : name(other.name), age(other.age), major(other.major) {}
    
    // Destructor
    ~Student() {
        cout << "Student " << name << " destroyed" << endl;
    }
    
    // Getter methods
    string getName() const { return name; }
    int getAge() const { return age; }
    string getMajor() const { return major; }
    
    // Setter methods
    void setName(const string& n) { name = n; }
    void setAge(int a) { age = a; }
    void setMajor(const string& m) { major = m; }
    
    // Method
    void displayInfo() const {
        cout << name << " is " << age << " years old, studying " << major << endl;
    }
    
    // Operator overloading
    bool operator==(const Student& other) const {
        return name == other.name && age == other.age && major == other.major;
    }
};
\`\`\`

**4. Memory Management:**
\`\`\`cpp
// Smart pointers (C++11+)
#include <memory>

// Unique pointer (exclusive ownership)
unique_ptr<int> uniquePtr = make_unique<int>(42);
cout << *uniquePtr << endl; // Dereference

// Shared pointer (shared ownership)
shared_ptr<string> sharedPtr1 = make_shared<string>("Hello");
shared_ptr<string> sharedPtr2 = sharedPtr1; // Reference count increases
cout << "Reference count: " << sharedPtr1.use_count() << endl;

// Weak pointer (non-owning reference)
weak_ptr<string> weakPtr = sharedPtr1;
if (auto locked = weakPtr.lock()) {
    cout << *locked << endl;
}

// Raw pointers (avoid when possible)
int* rawPtr = new int(42);
delete rawPtr; // Manual memory management
\`\`\`

**5. Templates:**
\`\`\`cpp
// Function template
template<typename T>
T maximum(T a, T b) {
    return (a > b) ? a : b;
}

// Class template
template<typename T>
class Container {
private:
    T data;
    
public:
    Container(T value) : data(value) {}
    
    T getValue() const { return data; }
    void setValue(T value) { data = value; }
    
    void display() const {
        cout << "Container holds: " << data << endl;
    }
};

// Template specialization
template<>
class Container<string> {
private:
    string data;
    
public:
    Container(string value) : data(value) {}
    
    string getValue() const { return data; }
    void setValue(string value) { data = value; }
    
    void display() const {
        cout << "String container holds: \"" << data << "\"" << endl;
    }
};

// Usage
Container<int> intContainer(42);
Container<string> stringContainer("Hello");
\`\`\`

**6. STL (Standard Template Library):**
\`\`\`cpp
#include <vector>
#include <map>
#include <set>
#include <algorithm>
#include <functional>

// Vector operations
vector<int> numbers = {3, 1, 4, 1, 5, 9, 2, 6};
sort(numbers.begin(), numbers.end());

// Map (key-value pairs)
map<string, int> ages;
ages["Alice"] = 25;
ages["Bob"] = 30;
ages["Charlie"] = 28;

// Set (unique elements)
set<int> uniqueNumbers = {1, 2, 2, 3, 3, 4}; // Only {1, 2, 3, 4}

// Lambda expressions (C++11+)
auto lambda = [](int x) { return x * x; };
vector<int> squares;
transform(numbers.begin(), numbers.end(), back_inserter(squares), lambda);

// Range-based for loop (C++11+)
for (const auto& pair : ages) {
    cout << pair.first << ": " << pair.second << endl;
}
\`\`\`

**7. Exception Handling:**
\`\`\`cpp
class DivisionByZeroException : public exception {
public:
    const char* what() const noexcept override {
        return "Division by zero is not allowed";
    }
};

double safeDivide(double a, double b) {
    if (b == 0.0) {
        throw DivisionByZeroException();
    }
    return a / b;
}

void testDivision() {
    try {
        double result = safeDivide(10.0, 0.0);
        cout << "Result: " << result << endl;
    } catch (const DivisionByZeroException& e) {
        cerr << "Error: " << e.what() << endl;
    } catch (const exception& e) {
        cerr << "Unexpected error: " << e.what() << endl;
    }
}
\`\`\`

**8. Modern C++ Features (C++11+):**
\`\`\`cpp
// Auto keyword
auto number = 42; // int
auto text = "Hello"; // const char*
auto vector = {1, 2, 3, 4, 5}; // initializer_list<int>

// Range-based for loop
vector<int> numbers = {1, 2, 3, 4, 5};
for (const auto& num : numbers) {
    cout << num << " ";
}

// Lambda expressions
auto sum = [](int a, int b) { return a + b; };
auto result = sum(3, 4);

// nullptr
int* ptr = nullptr; // Instead of NULL

// Uniform initialization
vector<int> vec{1, 2, 3, 4, 5};
map<string, int> ages{{"Alice", 25}, {"Bob", 30}};
\`\`\`

**9. Best Practices:**
- Use RAII (Resource Acquisition Is Initialization)
- Prefer smart pointers over raw pointers
- Use const correctness
- Follow the Rule of Three/Five
- Use references to avoid copying
- Prefer std::vector over C-style arrays
- Use range-based for loops when possible
- Write exception-safe code

**Next Steps:**
- Learn about move semantics and rvalue references
- Study design patterns in C++
- Explore template metaprogramming
- Learn about C++20 features (concepts, ranges, etc.)
- Practice with real-world projects
- Study performance optimization techniques`;
    }

    if (lowerQuestion.includes('typescript') || lowerQuestion.includes('ts')) {
      return `**TypeScript Programming - Complete Guide:**

**1. TypeScript Fundamentals:**

**Basic Types:**
\`\`\`typescript
// Primitive types
let name: string = "Alice";
let age: number = 25;
let isStudent: boolean = true;
let nothing: null = null;
let undefined: undefined = undefined;

// Complex types
let numbers: number[] = [1, 2, 3, 4, 5];
let names: Array<string> = ["Alice", "Bob", "Charlie"];

// Tuple (fixed-length array)
let person: [string, number] = ["Alice", 25];

// Object type
let user: { name: string; age: number; email?: string } = {
    name: "Alice",
    age: 25
};

// Union types
let id: string | number = "abc123";
let status: "loading" | "success" | "error" = "loading";

// Type aliases
type Point = {
    x: number;
    y: number;
};

type UserID = string | number;
\`\`\`

**2. Functions & Interfaces:**
\`\`\`typescript
// Function with type annotations
function add(a: number, b: number): number {
    return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Function with optional parameters
function greet(name: string, greeting?: string): string {
    return greeting ? \`\${greeting}, \${name}!\` : \`Hello, \${name}!\`;
}

// Function with rest parameters
function sum(...numbers: number[]): number {
    return numbers.reduce((acc, num) => acc + num, 0);
}

// Interface definition
interface User {
    id: string;
    name: string;
    email: string;
    age?: number;
    readonly createdAt: Date;
}

// Interface with methods
interface Calculator {
    add(a: number, b: number): number;
    subtract(a: number, b: number): number;
    multiply(a: number, b: number): number;
    divide(a: number, b: number): number;
}

// Implementing interface
class BasicCalculator implements Calculator {
    add(a: number, b: number): number {
        return a + b;
    }
    
    subtract(a: number, b: number): number {
        return a - b;
    }
    
    multiply(a: number, b: number): number {
        return a * b;
    }
    
    divide(a: number, b: number): number {
        if (b === 0) throw new Error("Division by zero");
        return a / b;
    }
}
\`\`\`

**3. Classes & Inheritance:**
\`\`\`typescript
// Base class
abstract class Shape {
    protected color: string;
    
    constructor(color: string) {
        this.color = color;
    }
    
    abstract getArea(): number;
    abstract getPerimeter(): number;
    
    getColor(): string {
        return this.color;
    }
}

// Derived class
class Circle extends Shape {
    private radius: number;
    
    constructor(color: string, radius: number) {
        super(color);
        this.radius = radius;
    }
    
    getArea(): number {
        return Math.PI * this.radius ** 2;
    }
    
    getPerimeter(): number {
        return 2 * Math.PI * this.radius;
    }
    
    getRadius(): number {
        return this.radius;
    }
}

// Generic class
class Container<T> {
    private value: T;
    
    constructor(value: T) {
        this.value = value;
    }
    
    getValue(): T {
        return this.value;
    }
    
    setValue(value: T): void {
        this.value = value;
    }
}

// Usage
const stringContainer = new Container<string>("Hello");
const numberContainer = new Container<number>(42);
\`\`\`

**4. Advanced Types:**
\`\`\`typescript
// Generic types
type ApiResponse<T> = {
    data: T;
    status: number;
    message: string;
};

// Conditional types
type NonNullable<T> = T extends null | undefined ? never : T;

// Mapped types
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

type Partial<T> = {
    [P in keyof T]?: T[P];
};

// Utility types
type User = {
    id: string;
    name: string;
    email: string;
    age: number;
};

type UserWithoutId = Omit<User, 'id'>;
type UserOptional = Partial<User>;
type UserReadonly = Readonly<User>;

// Template literal types
type EmailLocale = 'en' | 'es' | 'fr';
type EmailTemplate = \`welcome_\${EmailLocale}\`;

// Index access types
type UserName = User['name'];
type UserKeys = keyof User;
\`\`\`

**5. Decorators & Metadata:**
\`\`\`typescript
// Class decorator
function Logger(constructor: Function) {
    console.log('Logging...');
    console.log(constructor);
}

// Method decorator
function Log(target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
        console.log('Method ' + propertyName + ' called with args:', args);
        const result = method.apply(this, args);
        console.log('Method ' + propertyName + ' returned:', result);
        return result;
    };
}

@Logger
class Product {
    title: string;
    price: number;
    
    constructor(t: string, p: number) {
        this.title = t;
        this.price = p;
    }
    
    @Log
    getPriceWithTax(tax: number) {
        return this.price * (1 + tax);
    }
}
\`\`\`

**6. Modules & Namespaces:**
\`\`\`typescript
// math.ts
export interface Point {
    x: number;
    y: number;
}

export function distance(p1: Point, p2: Point): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export class Calculator {
    static add(a: number, b: number): number {
        return a + b;
    }
}

// Default export
export default class Geometry {
    static areaOfCircle(radius: number): number {
        return Math.PI * radius * radius;
    }
}

// main.ts
import Geometry, { Point, distance, Calculator } from './math';

const p1: Point = { x: 0, y: 0 };
const p2: Point = { x: 3, y: 4 };
console.log(distance(p1, p2)); // 5
console.log(Calculator.add(2, 3)); // 5
console.log(Geometry.areaOfCircle(5)); // 78.54...
\`\`\`

**7. Type Guards & Assertions:**
\`\`\`typescript
// Type guards
function isString(value: any): value is string {
    return typeof value === 'string';
}

function isNumber(value: any): value is number {
    return typeof value === 'number';
}

function processValue(value: string | number) {
    if (isString(value)) {
        console.log(value.toUpperCase()); // TypeScript knows it's a string
    } else if (isNumber(value)) {
        console.log(value.toFixed(2)); // TypeScript knows it's a number
    }
}

// instanceof type guard
class Dog {
    bark() {
        return 'Woof!';
    }
}

class Cat {
    meow() {
        return 'Meow!';
    }
}

function makeSound(animal: Dog | Cat) {
    if (animal instanceof Dog) {
        return animal.bark();
    } else {
        return animal.meow();
    }
}

// Type assertions
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext('2d')!; // Non-null assertion
\`\`\`

**8. Best Practices:**
- Use strict mode in tsconfig.json
- Prefer interfaces over type aliases for object shapes
- Use readonly for immutable properties
- Leverage utility types (Partial, Pick, Omit, etc.)
- Use type guards for runtime type checking
- Avoid 'any' type - use 'unknown' instead
- Use const assertions for literal types
- Implement proper error handling with custom types

**Next Steps:**
- Learn React with TypeScript
- Explore Node.js with TypeScript
- Study advanced type patterns
- Practice with real-world projects
- Learn about TypeScript compiler API
- Explore decorators and metadata reflection`;
    }

    if (lowerQuestion.includes('go') || lowerQuestion.includes('golang')) {
      return `**Go Programming - Complete Guide:**

**1. Go Fundamentals:**

**Basic Syntax & Types:**
\`\`\`go
package main

import (
    "fmt"
    "time"
)

// Variables and constants
var name string = "Alice"
const age = 25

// Short variable declaration
message := "Hello, Go!"

// Basic types
var (
    integer   int     = 42
    floating  float64 = 3.14159
    boolean   bool    = true
    character rune    = 'A'
    text      string  = "Hello, World!"
)

// Arrays and slices
numbers := [5]int{1, 2, 3, 4, 5} // Fixed-size array
dynamicNumbers := []int{1, 2, 3, 4, 5} // Slice
dynamicNumbers = append(dynamicNumbers, 6)

// Maps
ages := map[string]int{
    "Alice": 25,
    "Bob":   30,
    "Charlie": 28,
}
\`\`\`

**2. Functions & Methods:**
\`\`\`go
// Basic function
func add(a, b int) int {
    return a + b
}

// Function with multiple return values
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("division by zero")
    }
    return a / b, nil
}

// Named return values
func getCoordinates() (x, y int) {
    x = 10
    y = 20
    return // naked return
}

// Variadic functions
func sum(numbers ...int) int {
    total := 0
    for _, num := range numbers {
        total += num
    }
    return total
}

// Function as a type
type Operation func(int, int) int

func applyOperation(a, b int, op Operation) int {
    return op(a, b)
}

// Usage
result := applyOperation(5, 3, func(a, b int) int {
    return a * b
})
\`\`\`

**3. Structs & Methods:**
\`\`\`go
// Struct definition
type Person struct {
    Name string
    Age  int
    Email string
}

// Method with value receiver
func (p Person) GetInfo() string {
    return fmt.Sprintf("%s is %d years old", p.Name, p.Age)
}

// Method with pointer receiver (can modify the struct)
func (p *Person) Birthday() {
    p.Age++
}

// Constructor function
func NewPerson(name string, age int, email string) *Person {
    return &Person{
        Name:  name,
        Age:   age,
        Email: email,
    }
}

// Embedded structs (composition)
type Address struct {
    Street  string
    City    string
    Country string
}

type Employee struct {
    Person  // Embedded struct
    Address // Embedded struct
    Salary  float64
}

// Method on embedded struct
func (e Employee) GetFullInfo() string {
    return fmt.Sprintf("%s, %s, %s", e.GetInfo(), e.Address.City, e.Address.Country)
}
\`\`\`

**4. Interfaces:**
\`\`\`go
// Interface definition
type Shape interface {
    Area() float64
    Perimeter() float64
}

// Implementing interfaces
type Circle struct {
    Radius float64
}

func (c Circle) Area() float64 {
    return math.Pi * c.Radius * c.Radius
}

func (c Circle) Perimeter() float64 {
    return 2 * math.Pi * c.Radius
}

type Rectangle struct {
    Width  float64
    Height float64
}

func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

func (r Rectangle) Perimeter() float64 {
    return 2 * (r.Width + r.Height)
}

// Function that works with any Shape
func PrintShapeInfo(s Shape) {
    fmt.Printf("Area: %.2f, Perimeter: %.2f\\n", s.Area(), s.Perimeter())
}

// Empty interface (accepts any type)
func PrintAnything(v interface{}) {
    fmt.Printf("Value: %v, Type: %T\\n", v, v)
}

// Type assertions
func processValue(v interface{}) {
    if str, ok := v.(string); ok {
        fmt.Printf("String: %s\\n", str)
    } else if num, ok := v.(int); ok {
        fmt.Printf("Number: %d\\n", num)
    } else {
        fmt.Printf("Unknown type: %T\\n", v)
    }
}
\`\`\`

**5. Concurrency with Goroutines:**
\`\`\`go
// Goroutine (lightweight thread)
func worker(id int, jobs <-chan int, results chan<- int) {
    for job := range jobs {
        fmt.Printf("Worker %d processing job %d\\n", id, job)
        time.Sleep(time.Second) // Simulate work
        results <- job * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)

    // Start workers
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }

    // Send jobs
    for j := 1; j <= 9; j++ {
        jobs <- j
    }
    close(jobs)

    // Collect results
    for a := 1; a <= 9; a++ {
        <-results
    }
}

// Select statement
func selectExample() {
    ch1 := make(chan string)
    ch2 := make(chan string)

    go func() {
        time.Sleep(1 * time.Second)
        ch1 <- "from channel 1"
    }()

    go func() {
        time.Sleep(2 * time.Second)
        ch2 <- "from channel 2"
    }()

    for i := 0; i < 2; i++ {
        select {
        case msg1 := <-ch1:
            fmt.Println(msg1)
        case msg2 := <-ch2:
            fmt.Println(msg2)
        case <-time.After(3 * time.Second):
            fmt.Println("timeout")
        }
    }
}
\`\`\`

**6. Error Handling:**
\`\`\`go
// Custom error type
type ValidationError struct {
    Field string
    Message string
}

func (e ValidationError) Error() string {
    return fmt.Sprintf("validation error on %s: %s", e.Field, e.Message)
}

// Error handling patterns
func validateUser(name, email string) error {
    if name == "" {
        return ValidationError{Field: "name", Message: "cannot be empty"}
    }
    if email == "" {
        return ValidationError{Field: "email", Message: "cannot be empty"}
    }
    return nil
}

// Wrapping errors
func processUser(name, email string) error {
    if err := validateUser(name, email); err != nil {
        return fmt.Errorf("failed to process user: %w", err)
    }
    return nil
}

// Error checking
func main() {
    if err := processUser("", "alice@example.com"); err != nil {
        var validationErr ValidationError
        if errors.As(err, &validationErr) {
            fmt.Printf("Validation error: %s\\n", validationErr.Message)
        } else {
            fmt.Printf("Unexpected error: %v\\n", err)
        }
    }
}
\`\`\`

**7. Testing:**
\`\`\`go
// math_test.go
package math

import "testing"

func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive numbers", 2, 3, 5},
        {"negative numbers", -1, -2, -3},
        {"zero", 0, 5, 5},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := Add(tt.a, tt.b)
            if result != tt.expected {
                t.Errorf("Add(%d, %d) = %d; want %d", tt.a, tt.b, result, tt.expected)
            }
        })
    }
}

// Benchmark
func BenchmarkAdd(b *testing.B) {
    for i := 0; i < b.N; i++ {
        Add(1, 2)
    }
}

// Example
func ExampleAdd() {
    result := Add(2, 3)
    fmt.Println(result)
    // Output: 5
}
\`\`\`

**8. Best Practices:**
- Follow Go naming conventions (camelCase for variables, PascalCase for exported names)
- Use meaningful package names
- Handle errors explicitly
- Use composition over inheritance
- Write comprehensive tests
- Use gofmt for code formatting
- Leverage the standard library
- Use context for cancellation and timeouts
- Prefer slices over arrays for dynamic data
- Use interfaces for abstraction

**Next Steps:**
- Learn about Go modules and dependency management
- Explore web development with Gin or Echo
- Study microservices with Go
- Learn about Go toolchain (go mod, go test, go build)
- Practice with real-world projects
- Explore Go concurrency patterns
- Learn about Go performance optimization`;
    }

    // Enhanced default response that answers EVERY question like a modern AI assistant
    return `I understand you're asking about: **"${question}"**

Let me provide you with a comprehensive and helpful response to your question:

## **Understanding Your Question**
Your question appears to be about a topic that could be approached from multiple angles. Let me break this down and give you the most relevant information.

## **Key Concepts & Fundamentals**
Based on what you're asking, here are the essential concepts you should understand:

**1. Core Principles:**
- Fundamental theories and concepts related to your question
- Basic terminology and definitions
- Important relationships and dependencies

**2. Practical Applications:**
- Real-world use cases and examples
- Industry applications and best practices
- Common implementations and solutions

**3. Technical Details:**
- Step-by-step processes and methodologies
- Formulas, algorithms, or code examples where applicable
- Performance considerations and optimization strategies

## **Detailed Explanation**
Here's a comprehensive breakdown of what you need to know:

**Background Context:**
Understanding the context and history of this topic helps provide better insights into current applications and future developments.

**Current State:**
Modern approaches, tools, and technologies that are relevant to your question.

**Best Practices:**
Industry-standard methodologies, design patterns, and approaches that have proven effective.

**Common Challenges:**
Potential issues you might encounter and how to address them proactively.

## **Step-by-Step Approach**
To effectively work with this topic, consider these steps:

1. **Research & Planning:** Gather information and create a structured approach
2. **Implementation:** Apply the concepts with practical examples
3. **Testing & Validation:** Verify your understanding and results
4. **Optimization:** Refine and improve your approach
5. **Documentation:** Record your findings and solutions

## **Examples & Code Snippets**
Here are some practical examples that might help:

\`\`\`
// Example implementation or code structure
function exampleFunction(input) {
    // Process the input
    const result = processInput(input);
    
    // Return the result
    return result;
}
\`\`\`

## **Additional Resources**
To deepen your understanding, consider exploring:

- **Documentation:** Official documentation and technical specifications
- **Tutorials:** Step-by-step guides and video tutorials
- **Community:** Forums, Stack Overflow, and discussion groups
- **Books & Courses:** Structured learning materials
- **Practice Projects:** Hands-on experience with real-world applications

## **Next Steps & Recommendations**
Based on your question, I recommend:

1. **Start with the basics** - Ensure you have a solid foundation
2. **Practice regularly** - Apply concepts through hands-on projects
3. **Stay updated** - Follow industry trends and new developments
4. **Join communities** - Connect with others working in this area
5. **Build a portfolio** - Document your projects and achievements

## **Need More Specific Information?**
If you'd like me to focus on a particular aspect of "${question}", please let me know:

- **Technical implementation details**
- **Code examples and syntax**
- **Best practices and design patterns**
- **Performance optimization strategies**
- **Real-world applications and case studies**
- **Common pitfalls and how to avoid them**

I'm here to provide you with the most accurate, helpful, and actionable information possible. Feel free to ask follow-up questions or request more specific examples!`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              🎓
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Engineer Tom</h1>
              <p className="text-gray-600 text-sm font-medium">AI Engineering Assistant with Voice</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-xl">
                🎓
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Engineer Tom</h2>
              <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">Your intelligent AI assistant for programming, engineering, mathematics, and system management. Ask me anything with text or voice!</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="font-bold text-gray-800 mb-3 text-lg">💻 Programming</h3>
                  <p className="text-gray-600">React components, algorithms, data structures, and modern development practices</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="font-bold text-gray-800 mb-3 text-lg">🔧 Engineering</h3>
                  <p className="text-gray-600">System design, networking, databases, and architectural patterns</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="font-bold text-gray-800 mb-3 text-lg">📐 Mathematics</h3>
                  <p className="text-gray-600">Calculus, physics, problem solving, and mathematical concepts</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="font-bold text-gray-800 mb-3 text-lg">🎤 Voice Input</h3>
                  <p className="text-gray-600">Speak your questions and hear responses with voice synthesis</p>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.sender === 'ai' && (
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-lg">
                    🎓
                  </div>
                )}
                <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-1' : 'order-2'}`}>
                  <div className={`p-6 rounded-2xl ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg' 
                      : 'bg-white border border-gray-200 text-gray-800 shadow-lg'
                  }`}>
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-base leading-relaxed font-medium">{message.content}</div>
                    </div>
                  </div>
                </div>
                {message.sender === 'user' && (
                  <div className="w-10 h-10 bg-gray-300 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-lg">
                    👤
                  </div>
                )}
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-lg">
                  🎓
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded-2xl text-gray-800 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-3 h-3 bg-purple-700 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                    <span className="text-gray-600 text-base font-medium">Engineer Tom is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white shadow-lg border-t border-gray-200 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask Engineer Tom anything about programming, engineering, or mathematics..."
                className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-base font-medium shadow-sm"
                rows={1}
                disabled={isLoading}
                style={{ minHeight: '64px', maxHeight: '200px' }}
              />
            </div>
            
            {/* Voice Button */}
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading}
              className={`px-4 py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-base shadow-lg hover:shadow-xl transform hover:scale-105 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? '🔴' : '🎤'}
            </button>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-8 py-5 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-2xl hover:from-purple-600 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-base shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Send
            </button>
          </div>
          
          {/* Voice Status */}
          {(isListening || isSpeaking) && (
            <div className="mt-3 flex items-center justify-center gap-2 text-sm font-medium">
              {isListening && (
                <div className="flex items-center gap-2 text-red-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Listening... Speak now
                </div>
              )}
              {isSpeaking && (
                <div className="flex items-center gap-2 text-purple-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  Speaking response...
                </div>
              )}
            </div>
          )}
          
          <div className="mt-3 text-xs text-gray-500 text-center font-medium">
            Press Enter to send, Shift+Enter for new line • Click 🎤 for voice input
          </div>
        </div>
      </div>
    </div>
  );
} 