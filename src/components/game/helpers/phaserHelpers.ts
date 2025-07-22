import * as Phaser from 'phaser';

// Named text registry
const textRegistry: Record<string, Phaser.GameObjects.Text> = {};

export function addText(
  scene: Phaser.Scene,
  name: string,
  x: number,
  y: number,
  content: string,
  style?: Phaser.Types.GameObjects.Text.TextStyle
): Phaser.GameObjects.Text {
  const defaultStyle: Phaser.Types.GameObjects.Text.TextStyle = { 
    fontSize: '16px', 
    color: '#000' 
  };
  const finalStyle = { ...defaultStyle, ...style };
  
  const text = scene.add.text(x, y, content, finalStyle);
  text.setOrigin(0, 0);
  
  textRegistry[name] = text;
  return text;
}

export function updateText(name: string, newContent: string): void {
  if (textRegistry[name]) {
    textRegistry[name].setText(newContent);
  }
}

export function getTextObject(name: string): Phaser.GameObjects.Text | null {
  return textRegistry[name] || null;
}

// Helper function to create simple shapes with physics
export function createPhysicsShape(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  color: number = 0x3fa7d6,
  isStatic: boolean = false
): Phaser.GameObjects.Rectangle {
  const shape = scene.add.rectangle(x, y, width, height, color);
  scene.matter.add.gameObject(shape, {
    isStatic: isStatic,
    friction: 0.3,
    frictionStatic: 0.5,
  });
  return shape;
}

// Helper to create graphics objects with physics
export function createPhysicsGraphics(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  isStatic: boolean = false,
  options?: MatterJS.IBodyDefinition
): Phaser.GameObjects.Graphics {
  const graphics = scene.add.graphics();
  graphics.setPosition(x, y);

  const defaultOptions: MatterJS.IBodyDefinition = {
    isStatic: isStatic,
    friction: 0.3,
    frictionStatic: 0.5,
    restitution: 0.1,
    ...options
  };

  scene.matter.add.gameObject(graphics, {
    shape: { type: 'rectangle', width: width, height: height },
    ...defaultOptions
  });

  return graphics;
}
