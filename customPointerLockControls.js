import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'


export class CustomPointerLockControls extends PointerLockControls {
  constructor(camera, domElement) {
    super(camera, domElement);

    // Define the maximum and minimum vertical angles (in radians) allowed for rotation
    this.minVerticalAngle = -Math.PI / 4; // 45 degrees upwards
    this.maxVerticalAngle = Math.PI / 4; // 45 degrees downwards
  }

  // Override the update method to restrict the camera's vertical rotation
  update(delta) {
    if (this.isLocked === false) return;

    // Get the camera's direction vector
    const direction = new THREE.Vector3(0, 0, -1);
    this.camera.getWorldDirection(direction);

    // Calculate the vertical angle of the camera's direction
    const verticalAngle = Math.asin(direction.y);

    // Apply the original PointerLockControls' update method only if the vertical angle is within the allowed range
    if (verticalAngle >= this.minVerticalAngle && verticalAngle <= this.maxVerticalAngle) {
      super.update(delta);
    } else {
      // Reset the rotation to prevent further rotation in that direction
      this.moveState.yawLeft = 0;
      this.moveState.yawRight = 0;
      this.moveState.pitchUp = 0;
      this.moveState.pitchDown = 0;
      this.moveState.forward = 0;
      this.moveState.backward = 0;
      this.moveState.left = 0;
      this.moveState.right = 0;
      this.moveState.up = 0;
      this.moveState.down = 0;
    }
  }
}


