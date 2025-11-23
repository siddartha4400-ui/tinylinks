export default function VideoPlayer() {
          return (
                    <div className="w-full flex justify-center">
                              <video
                                        src="/video-2025-11-24-001422.mp4"
                                        controls
                                        autoPlay={false}
                                        className="w-full max-w-3xl rounded-lg shadow"
                              />
                    </div>
          );
}
