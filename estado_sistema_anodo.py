import RPi.GPIO as GPIO
import time
import subprocess
import requests

LED_VERDE = 5
LED_AZUL = 6
LED_ROJO = 12
FLASK_PORT = 5001
CHECK_INTERVAL = 5

def setup_gpio():
  GPIO.setmode(GPIO.BCM)
  for pin in [LED_VERDE, LED_AZUL, LED_ROJO]:
    GPIO.setup(pin, GPIO.OUT)
    GPIO.output(pin, GPIO.HIGH)

def set_color(r=False, g=False, b=False):
  GPIO.output(LED_ROJO, GPIO.HIGH if r else GPIO.LOW)
  GPIO.output(LED_VERDE, GPIO.HIGH if g else GPIO.LOW)
  GPIO.output(LED_AZUL, GPIO.HIGH if b else GPIO.LOW)

def blink_color(r=False, g=False, b=False, times=1, delay=0.5):
  for _ in range(times):
    set_color(r, g, b)
    time.sleep(delay)
    set_color(False, False, False)
    time.sleep(delay)

def is_docker_container_running(container_name="apollocontainer"):
  try:
    result = subprocess.run(
      ["docker", "ps", "--filter", f"name={container_name}", "--format", "{{.Names}}"],
      stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
    )
    return container_name in result.stdout
  except Exception as e:
    print("Error verificando contenedor:", e)
    return False

def main():
  setup_gpio()
  print("Sistema de monitoreo iniciado (ánodo común)...")
  for _ in range(10):
    blink_color(g=True, times=1, delay=0.3)
  while True:
    try:
      if is_docker_container_running():
        set_color(g=True)
      else:
        blink_color(r=True, times=3, delay=0.4)
    except Exception as e:
      print("Error inesperado:", e)
      blink_color(r=True, times=5, delay=0.3)
    time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
  try:
    main()
  except KeyboardInterrupt:
    GPIO.cleanup()
