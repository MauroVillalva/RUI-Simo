import serial

ser = serial.Serial('/dev/ttyAMA0', baudrate=9600) # Example: /dev/tty50 at 9600 baud
# Or, if using a built-in UART:
# ser = serial.Serial('/dev/ttyAMA0', baudrate=9600)

data = ser.read()
print(data)

data = ser.read(10)
print(data)

line = ser.readline()
print(line.decode()) # Decode bytes to string

ser.close()

# Example Python script to read data:
# import serial

# ser = serial.Serial('/dev/ttyUSB0', baudrate=9600)

# while True:
#     line = ser.readline()
#     if line:
#         print(line.decode().strip())

# ser.close()