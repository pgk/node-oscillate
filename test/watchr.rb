# watchr tests os x
watch('^test/(.*)\.js') {|match| vows "test/#{match[1]}.js"}

watch('^lib/(.*)\.js') {|match| vows "test/#{match[1]}-test.js"}

watch('^(.*)\.js') { |match| vows "test/#{match[1]}-test.js" }

def vows file
  system "vows #{file}"
end
