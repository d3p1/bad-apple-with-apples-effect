/**
 * @description App
 * @author      C. M. de Picciotto <d3p1@d3p1.dev> (https://d3p1.dev/)
 */
import badAppleVideo from '../media/videos/bad-apple.mp4'

class App {
  /**
   * @type {HTMLVideoElement}
   */
  #video: HTMLVideoElement

  /**
   * @type {HTMLCanvasElement}
   */
  #canvas: HTMLCanvasElement

  /**
   * @type {CanvasRenderingContext2D}
   */
  #context: CanvasRenderingContext2D

  /**
   * @type {number}
   */
  #cellWidthSize: number

  /**
   * @type {number}
   */
  #cellHeightSize: number

  /**
   * Constructor
   *
   * @param {number} resolutionWidth
   * @param {number} resolutionHeight
   */
  constructor(resolutionWidth: number, resolutionHeight: number) {
    this.#initCanvas()
    this.#initGrid(resolutionWidth, resolutionHeight)
    this.#initVideo()
  }

  /**
   * Run
   *
   * @returns {void}
   */
  #run(): void {
    this.#clearCanvas()

    this.#drawVideo()

    this.#postProcessing()

    requestAnimationFrame(this.#run.bind(this))
  }

  /**
   * Post-processing
   *
   * @returns {void}
   */
  #postProcessing(): void {
    const currentImgData = this.#context.getImageData(
      0,
      0,
      this.#canvas.width,
      this.#canvas.height,
    )
    const currentData = currentImgData.data

    this.#clearCanvas()
    for (let y = 0; y < this.#canvas.height; y += this.#cellHeightSize) {
      for (let x = 0; x < this.#canvas.width; x += this.#cellWidthSize) {
        const i = (y * this.#canvas.width + x) * 4
        if (currentData[i] < 200) {
          this.#drawApple(x, y)
        }
      }
    }
  }

  /**
   * Draw video
   *
   * @returns {void}
   */
  #drawVideo(): void {
    this.#context.drawImage(
      this.#video,
      0,
      0,
      this.#canvas.width,
      this.#canvas.height,
    )
  }

  /**
   * Draw apple
   *
   * @param   {number} x
   * @param   {number} y
   * @returns {void}
   * @note    For now, it is used the cell width size
   *          to determine apple dimensions, and we do not care if
   *          overflow in the height dimension
   */
  #drawApple(x: number, y: number): void {
    this.#context.font = `${this.#cellWidthSize}px`
    this.#context.fillText('🍎', x, y)
  }

  /**
   * Clear canvas
   *
   * @returns {void}
   */
  #clearCanvas(): void {
    this.#context.fillStyle = '#fff'
    this.#context.textAlign = 'center'
    this.#context.textBaseline = 'middle'
    this.#context.fillRect(0, 0, this.#canvas.width, this.#canvas.height)
  }

  /**
   * Init video
   *
   * @returns {void}
   */
  #initVideo(): void {
    this.#video = document.createElement('video')
    this.#video.src = badAppleVideo
    this.#video.muted = true

    this.#video.addEventListener('loadeddata', () => {
      this.#canvas.width = this.#video.videoWidth
      this.#canvas.height = this.#video.videoHeight
    })

    this.#video.play().then(() => this.#run())
  }

  /**
   * Init canvas
   *
   * @returns {void}
   */
  #initCanvas(): void {
    this.#canvas = document.createElement('canvas')
    this.#context = this.#canvas.getContext('2d', {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D

    this.#canvas.style.border = '2px solid #000'
    document.body.appendChild(this.#canvas)
  }

  /**
   * Init grid
   *
   * @param   {number} resolutionWidth
   * @param   {number} resolutionHeight
   * @returns {void}
   */
  #initGrid(resolutionWidth: number, resolutionHeight: number): void {
    this.#cellWidthSize = Math.floor(this.#canvas.width / resolutionWidth)
    this.#cellHeightSize = Math.floor(this.#canvas.height / resolutionHeight)
  }
}
new App(15, 15)
