import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Dock from "../components/Dock";
import { Upload, Image as ImageIcon, Loader2, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import api from "../lib/axios";

const ExtractEvents = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [extractedEvents, setExtractedEvents] = useState(null);
  const [processedEvents, setProcessedEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState(null);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter(file => 
      file.type.startsWith('image/')
    );

    if (validFiles.length !== files.length) {
      toast.error("Chỉ chấp nhận file ảnh!");
      return;
    }

    setSelectedImages(validFiles);
    setError(null);
    setExtractedEvents(null);

    // Create preview URLs
    const urls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleRemoveImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    
    // Revoke the removed URL
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedImages(newImages);
    setPreviewUrls(newUrls);
  };

  const handleExtractEvents = async () => {
    if (selectedImages.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ảnh!");
      return;
    }

    setLoading(true);
    setError(null);
    setExtractedEvents(null);
    setProcessedEvents([]);

    try {
      // Create FormData
      const formData = new FormData();
      
      // Append all images with key "images"
      selectedImages.forEach((image) => {
        formData.append('images', image);
      });

      console.log('Uploading images to n8n...');
      console.log('Number of images:', selectedImages.length);

      // Call n8n API
      const response = await axios.post(
        'https://huy2242005.app.n8n.cloud/webhook-test/data-extractor',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 60 seconds timeout
        }
      );

      console.log('Response from n8n:', response.data);

      // Parse and transform the response
      const rawData = response.data;
      console.log('Raw data from n8n:', rawData);
      
      if (!Array.isArray(rawData) || rawData.length === 0) {
        throw new Error("API không trả về dữ liệu hợp lệ");
      }

      // Process each schedule item
      const allEvents = [];
      
      rawData.forEach((item) => {
        if (item.schedule) {
          // Parse the schedule JSON string
          const scheduleArray = JSON.parse(item.schedule);
          
          scheduleArray.forEach((schedule) => {
            // Convert to event format
            const event = {
              EventName: schedule.course_name || "Không có tên",
              RoomID: schedule.room_id || "",
              TimeStart: combineDateTime(selectedDate, schedule.start_time),
              TimeEnd: combineDateTime(selectedDate, schedule.end_time),
              Type: true, // Default to class
              Note: schedule.num_lessons ? `Số tiết: ${schedule.num_lessons}` : "",
              // Keep original data for reference
              _original: schedule
            };
            
            allEvents.push(event);
          });
        }
      });

      console.log('Processed events:', allEvents);
      for (const event of allEvents) {
        console.log('Event details:', event);
            try{
                await api.post('/events', event);
                console.log('Event saved successfully:', event.EventName);
            } catch (error) {
                console.error('Error saving event:', event.EventName, error);
            }


        }

      setExtractedEvents(rawData);
      setProcessedEvents(allEvents);
      toast.success(`Trích xuất thành công ${allEvents.length} sự kiện!`);

    } catch (err) {
      console.error('Error extracting events:', err);
      setError(err.message || "Có lỗi xảy ra khi trích xuất dữ liệu");
      toast.error("Không thể trích xuất dữ liệu từ ảnh!");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to combine date and time
  const combineDateTime = (date, time) => {
    if (!date || !time) return new Date().toISOString();
    
    // time format: "07:00" or "10:45"
    const [hours, minutes] = time.split(':');
    const dateObj = new Date(date);
    dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    return dateObj.toISOString();
  };

  const handleSaveEvents = async () => {
    console.log('=== handleSaveEvents called ===');
    console.log('processedEvents:', processedEvents);
    console.log('processedEvents length:', processedEvents?.length);
    
    if (!processedEvents || processedEvents.length === 0) {
      console.error('No events to save!');
      toast.error("Không có sự kiện nào để lưu!");
      return;
    }

    setLoading(true);
    console.log('Starting to save events to database...');
    console.log('Number of events to save:', processedEvents.length);

    try {
      // Import api
      const api = (await import('../lib/axios')).default;
      console.log('API imported successfully');
      
      // Prepare events data (remove _original field)
      const eventsToSave = processedEvents.map(event => ({
        RoomID: event.RoomID,
        EventName: event.EventName,
        TimeStart: event.TimeStart,
        TimeEnd: event.TimeEnd,
        Note: event.Note || "",
        Type: event.Type,
      }));

      console.log('Events to save (cleaned):', eventsToSave);
      console.log('API base URL:', api.defaults.baseURL);

      // Try batch create first (more efficient)
      try {
        console.log('Attempting batch create to /events/batch');
        const response = await api.post('/events/batch', eventsToSave);
        console.log('✅ Batch create SUCCESS!');
        console.log('Batch create response:', response.data);
        
        toast.success(`Đã lưu thành công ${processedEvents.length} sự kiện!`);
        
        // Clear data after successful save
        setSelectedImages([]);
        setPreviewUrls([]);
        setExtractedEvents(null);
        setProcessedEvents([]);
        setSelectedDate(new Date().toISOString().split('T')[0]);
        
      } catch (batchError) {
        console.error('❌ Batch create FAILED:', batchError);
        console.error('Error response:', batchError.response?.data);
        console.error('Error status:', batchError.response?.status);
        console.warn('Trying individual creates as fallback...');
        
        // Fallback: Save one by one
        let successCount = 0;
        let failCount = 0;
        const errors = [];

        for (let i = 0; i < eventsToSave.length; i++) {
          const event = eventsToSave[i];
          try {
            console.log(`Saving event ${i + 1}/${eventsToSave.length}:`, event.EventName);

            const response = await api.post('/events', event);
            console.log(`✅ Event ${i + 1} saved successfully:`, response.data);
            successCount++;
            
          } catch (err) {
            console.error(`❌ Error saving event ${i + 1}:`, err);
            console.error('Error details:', err.response?.data);
            failCount++;
            errors.push({
              event: event.EventName,
              error: err.response?.data?.message || err.message
            });
          }
        }

        // Show results
        if (successCount > 0) {
          toast.success(`Đã lưu thành công ${successCount}/${eventsToSave.length} sự kiện!`);
        }
        
        if (failCount > 0) {
          console.error('Failed events:', errors);
          toast.error(`Có ${failCount} sự kiện lưu thất bại. Xem console để biết chi tiết.`);
        }

        // Clear data if all succeeded
        if (successCount === eventsToSave.length) {
          setSelectedImages([]);
          setPreviewUrls([]);
          setExtractedEvents(null);
          setProcessedEvents([]);
          setSelectedDate(new Date().toISOString().split('T')[0]);
        }
      }
      
    } catch (error) {
      console.error('❌ Fatal error saving events:', error);
      console.error('Error stack:', error.stack);
      toast.error("Có lỗi khi lưu sự kiện vào database!");
    } finally {
      setLoading(false);
      console.log('=== handleSaveEvents finished ===');
    }
  };

  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <div className="min-h-screen w-screen flex flex-col bg-base-200">
      <Navbar />

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Trích xuất sự kiện từ ảnh</h1>
            <p className="text-base-content/70">
              Upload ảnh chứa thông tin sự kiện để tự động trích xuất dữ liệu
            </p>
          </div>

          {/* Upload Section */}
          <div className="card bg-base-100 shadow-lg mb-6">
            <div className="card-body">
              <h2 className="card-title mb-4">
                <ImageIcon className="size-5" />
                Chọn ảnh
              </h2>

              {/* Date Selector */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-semibold">Ngày diễn ra sự kiện</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  disabled={loading}
                />
                <label className="label">
                  <span className="label-text-alt">Thời gian trong ảnh sẽ được ghép với ngày này</span>
                </label>
              </div>

              {/* File Input */}
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-base-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Upload className="size-12 mx-auto mb-3 text-base-content/50" />
                  <p className="text-lg font-semibold mb-1">
                    Click để chọn ảnh
                  </p>
                  <p className="text-sm text-base-content/60">
                    Hỗ trợ: JPG, PNG, JPEG (Có thể chọn nhiều ảnh)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  disabled={loading}
                />
              </label>

              {/* Image Previews */}
              {previewUrls.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">
                    Đã chọn {selectedImages.length} ảnh
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg border-2 border-base-300"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 btn btn-circle btn-sm btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={loading}
                        >
                          <XCircle className="size-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 badge badge-sm badge-primary">
                          {selectedImages[index].name.slice(0, 15)}...
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extract Button */}
              {selectedImages.length > 0 && (
                <button
                  onClick={handleExtractEvents}
                  disabled={loading}
                  className="btn btn-primary btn-block mt-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Upload className="size-5" />
                      Trích xuất sự kiện
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error mb-6">
              <XCircle className="size-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Extracted Events */}
          {processedEvents && processedEvents.length > 0 && (
            <div className="card bg-base-100 shadow-lg mb-6">
              <div className="card-body">
                <h2 className="card-title mb-4">
                  <CheckCircle2 className="size-5 text-success" />
                  Kết quả trích xuất - {processedEvents.length} sự kiện
                </h2>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {processedEvents.map((event, index) => (
                    <div
                      key={index}
                      className="border border-base-300 rounded-lg p-4 hover:border-primary transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg">
                          {event.EventName}
                        </h3>
                        <span className="badge badge-primary">
                          #{index + 1}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-semibold">Phòng:</span> {event.RoomID}
                        </div>
                        <div>
                          <span className="font-semibold">Loại:</span>{" "}
                          {event.Type ? "Lớp học" : "Sự kiện khác"}
                        </div>
                        <div className="col-span-2">
                          <span className="font-semibold">Bắt đầu:</span>{" "}
                          {new Date(event.TimeStart).toLocaleString('vi-VN')}
                        </div>
                        <div className="col-span-2">
                          <span className="font-semibold">Kết thúc:</span>{" "}
                          {new Date(event.TimeEnd).toLocaleString('vi-VN')}
                        </div>
                      </div>

                      {event.Note && (
                        <p className="mt-2 text-sm text-base-content/70">
                          <span className="font-semibold">Ghi chú:</span> {event.Note}
                        </p>
                      )}

                      {/* Original data reference */}
                      {event._original && (
                        <div className="mt-2 pt-2 border-t border-base-300">
                          <details className="text-xs">
                            <summary className="cursor-pointer text-base-content/60">
                              Dữ liệu gốc
                            </summary>
                            <pre className="mt-1 p-2 bg-base-200 rounded overflow-x-auto">
                              {JSON.stringify(event._original, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    console.log('Button clicked!');
                    console.log('Current processedEvents:', processedEvents);
                    handleSaveEvents();
                  }}
                  disabled={loading}
                  className="btn btn-success btn-block mt-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-5" />
                      Lưu {processedEvents.length} sự kiện vào database
                    </>
                  )}
                </button>

                {/* Raw JSON (for debugging) */}
                <details className="collapse collapse-arrow bg-base-200 mt-4">
                  <summary className="collapse-title text-sm font-medium">
                    Xem dữ liệu API gốc
                  </summary>
                  <div className="collapse-content">
                    <pre className="text-xs overflow-x-auto p-4 bg-base-300 rounded">
                      {JSON.stringify(extractedEvents, null, 2)}
                    </pre>
                  </div>
                </details>
              </div>
            </div>
          )}
        </div>

        {/* Spacer for Dock */}
        <div className="h-20 flex-shrink-0"></div>
      </main>

      <Dock />
    </div>
  );
};

export default ExtractEvents;
