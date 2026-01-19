'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Paperclip, Search, Send, X, Image as ImageIcon, Video } from 'lucide-react'
import { useState, useRef } from 'react'
import Image from 'next/image'

interface UploadedFile {
  file: File
  preview: string
  type: 'image' | 'video'
}

export default function Page() {
  const [message, setMessage] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newFiles: UploadedFile[] = []

    Array.from(files).forEach((file) => {
      const fileType = file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
          ? 'video'
          : null

      if (fileType) {
        const preview = URL.createObjectURL(file)
        newFiles.push({ file, preview, type: fileType })
      }
    })

    setUploadedFiles([...uploadedFiles, ...newFiles])

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (index: number) => {
    const file = uploadedFiles[index]
    URL.revokeObjectURL(file.preview)
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  const handleSendMessage = () => {
    if (!message.trim() && uploadedFiles.length === 0) return

    // TODO: Implement actual message sending logic
    console.log('Sending message:', message)
    console.log('Attached files:', uploadedFiles)

    // Clear message and files after sending
    setMessage('')
    uploadedFiles.forEach((f) => URL.revokeObjectURL(f.preview))
    setUploadedFiles([])
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Messages</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="w-full flex items-start justify-center min-h-[90vh] gap-3">
          <div className="w-full max-w-[328px] bg-white p-[8px] h-full overflow-y-auto">
            <div className="relative w-full mb-4">
              <Search size={20} className="absolute top-2 left-2" />
              <input
                type="text"
                className="event-input border border-[#DFE4EC] p-[4px] rounded-[8px] h-[36px] w-full bg-white pl-8 text-sm placeholder:text-[#9AA2B1] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Search"
              />
            </div>

            <div className="w-full border-[#000000] border-l-[5px] h-[91px] mb-2 cursor-pointer bg-[#F9FAFB]">
              <div className="flex flex-col items-start justify-center p-2 w-full h-full gap-2">
                <div className="flex items-center justify-between w-full">
                  <p className="chat-list-name">Marcus Green</p>{' '}
                  <p className="chat-list-date">10:42A M</p>
                </div>

                <p className="chat-list-message">Hey! Are we still on for the meeting tomorrow?</p>
              </div>
            </div>
          </div>
          <div className="w-full border border-[#EAECF0] p-[16px] h-full overflow-y-auto flex flex-col gap-3 justify-between">
            <div className="message-content flex flex-col gap-3 h-full">
              <div className="chat-msg w-[50%] self-start">
                I want to learn golf to play with my grandfather and maybe play in college one day
              </div>
              <div className="chat-msg w-[50%] self-end">
                I want to learn golf to play with my grandfather and maybe play in college one day
              </div>
            </div>

            <div className="flex flex-col w-auto border-[#EAECF0] p-[16px] gap-3">
              {/* File Preview Area */}
              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 pb-2 border-b border-[#EAECF0]">
                  {uploadedFiles.map((fileData, index) => (
                    <div key={index} className="relative group">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-[#DFE4EC] bg-gray-50">
                        {fileData.type === 'image' ? (
                          <Image
                            src={fileData.preview}
                            alt={fileData.file.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <Video size={32} className="text-gray-500" />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                      <p className="text-xs text-gray-500 mt-1 truncate w-20">
                        {fileData.file.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Message Input Area */}
              <div className="flex gap-1 items-start">
                <div className="relative w-full">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="absolute top-3 left-2 cursor-pointer hover:text-[#FE532D] transition-colors"
                  >
                    <Paperclip size={20} />
                  </label>

                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="event-input border border-[#DFE4EC] p-[4px] rounded-[8px] h-[43px] w-full bg-white pl-10 text-sm placeholder:text-[#9AA2B1] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Type a message..."
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() && uploadedFiles.length === 0}
                  className="bg-[#FE532D] text-white h-[44px] w-[44px] hover:bg-[#e04e2a] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  variant="ghost"
                >
                  <Send size={30} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
