<template>
  <div class="terminal-box">
    <a-spin v-if="isLoading" />
    <a-empty v-if="isClose">
      <template #description>
        <p>断开链接</p>
        <a-button
          type="primary"
          @click="connect"
        >
          重新链接
        </a-button>
      </template>
    </a-empty>
    <div
      ref="terminalRef"
      style="background-color: #000; height: 100%"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Terminal } from 'xterm';
import 'xterm/lib/xterm.js';
import { CanvasAddon } from 'xterm-addon-canvas';
import { FitAddon } from 'xterm-addon-fit';
import { SearchAddon } from 'xterm-addon-search';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { io } from 'socket.io-client';
import 'xterm/css/xterm.css';

const props = defineProps<{ id: string }>();

const terminalRef = ref();
const isLoading = ref(true);
const isClose = ref(false);
const execId = ref('');

const fontSize = 16;
const lineHeight = 1.2;

const getRows = () =>
  Math.floor((document.body.clientHeight - 200) / (fontSize * lineHeight * lineHeight));
const rows = getRows();

const connect = () => {
  isLoading.value = true;
  isClose.value = false;
  const socket = io('/container');
  socket.on('connect', () => {
    const terminal = new Terminal({
      rows,
      fontSize,
      lineHeight,
    });
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    terminal.loadAddon(new SearchAddon());
    terminal.loadAddon(new WebLinksAddon());
    terminal.onData(data => {
      socket.emit('terminal-data', { execId: execId.value, text: data });
    });
    terminal.open(terminalRef.value);
    terminal.focus();
    fitAddon.fit();
    terminal.options.cursorBlink = true;

    window.onresize = function () {
      fitAddon?.fit();
      const rows = getRows();
      terminal.resize(terminal.cols, rows);
      terminal.scrollToBottom();
      socket.emit('terminal-resize', {
        execId: execId.value,
        rows,
        cols: terminal.cols,
      });
    };
    socket.on('success', id => {
      execId.value = id;
    });
    socket.on('data', chunk => {
      isLoading.value = false;
      terminal.write(chunk);
    });
    socket.on('error', () => {
      terminal.write('\n\r(connection closed)');
      setTimeout(() => {
        socket.close();
        terminal.dispose();
      }, 5000);
    });
    socket.on('end', () => {
      terminal.write('\n\r(connection closed)');
      setTimeout(() => {
        socket.close();
        terminal.dispose();
      }, 5000);
    });
    terminal.loadAddon(new CanvasAddon());
    socket.emit('terminal', { id: props.id, cols: terminal.cols, rows });
  });
  socket.on('disconnect', () => {
    isClose.value = true;
  });
};

onMounted(() => {
  if (terminalRef.value) {
    connect();
  }
});
</script>
<style scoped lang="less">
.terminal-box {
  min-height: calc(100vh - 200px);
}
</style>
